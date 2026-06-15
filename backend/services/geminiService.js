const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Model Cache with TTL ───────────────────────────────────────────────────────
// Cache expires every 6 hours so stale / deprecated models are dropped
// automatically without requiring a server restart.
const MODEL_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
let _cachedModels = null;
let _cacheTimestamp = 0;

// Stable, production-grade fallback models (ordered: fastest/cheapest first).
// These are GA (generally available) models — not previews — so they won't
// disappear without a deprecation notice.
const STABLE_FALLBACK_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

// ── Dynamic model discovery ───────────────────────────────────────────────────
// Fetches the live model list from Google AI and caches it with a TTL so that
// deprecated models are automatically dropped when the cache expires.
const getAvailableModels = async () => {
  const now = Date.now();
  if (_cachedModels && now - _cacheTimestamp < MODEL_CACHE_TTL_MS) {
    return _cachedModels;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const json = await res.json();

    if (!json.models) {
      console.warn('[Gemini] Could not fetch model list, using stable fallbacks.');
      _cachedModels = STABLE_FALLBACK_MODELS;
      _cacheTimestamp = now;
      return _cachedModels;
    }

    const supported = json.models
      .filter(m => {
        const name = m.name || '';
        const methods = Array.isArray(m.supportedGenerationMethods)
          ? m.supportedGenerationMethods
          : [];

        // Must support generateContent
        if (!methods.includes('generateContent')) return false;

        // Must be a Gemini model
        if (!/gemini/i.test(name)) return false;

        // ✅ KEY FIX: Exclude ALL preview / experimental / versioned snapshot models.
        // These are the ones Google removes without warning.
        //   e.g. gemini-2.5-flash-preview-05-20, gemini-1.5-pro-exp-0801
        if (/preview|exp(?:erimental)?-?\d/i.test(name)) return false;

        return true;
      })
      // Sort: prefer flash (fast + cheap) over pro, newer over older
      .sort((a, b) => {
        const score = name => {
          if (/2\.0-flash(?!-lite)/.test(name)) return 0; // gemini-2.0-flash ← best
          if (/2\.0-flash-lite/.test(name))    return 1;
          if (/1\.5-flash(?!-lite)/.test(name)) return 2;
          if (/1\.5-pro/.test(name))            return 3;
          if (/flash/.test(name))               return 4;
          if (/pro/.test(name))                 return 5;
          return 9;
        };
        return score(a.name) - score(b.name);
      })
      // Strip "models/" prefix — SDK expects bare model name
      .map(m => m.name.replace(/^models\//, ''));

    if (supported.length === 0) {
      console.warn('[Gemini] No stable models found from API, using hardcoded fallbacks.');
      _cachedModels = STABLE_FALLBACK_MODELS;
    } else {
      console.log('[Gemini] Available stable models:', supported);
      _cachedModels = supported;
    }

    _cacheTimestamp = now;
  } catch (err) {
    console.warn('[Gemini] Model list fetch failed, using stable fallbacks:', err.message);
    _cachedModels = STABLE_FALLBACK_MODELS;
    _cacheTimestamp = now;
  }

  return _cachedModels;
};

// ── Prompt builder ────────────────────────────────────────────────────────────
const buildPrompt = (resumeText, jobDescription = '') => {
  const jdSection = jobDescription
    ? `JOB DESCRIPTION PROVIDED:\n${jobDescription}`
    : 'NO JOB DESCRIPTION PROVIDED - skip jdMatch analysis, return empty jdMatch object.';

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `You are an expert AI career coach and resume analyst. Analyze the following resume and return a comprehensive JSON response covering all sections below. Return ONLY valid JSON, no markdown, no extra text.
  
CURRENT DATE CONTEXT: Today's date is ${currentDate}. Keep this in mind when evaluating timelines (e.g., a graduation or internship ending in 2026 or 2027 is perfectly valid and not a typo).

RESUME:
${resumeText}

${jdSection}

IMPORTANT INSTRUCTIONS:
1. The JSON structure below is JUST A TEMPLATE. 
2. DO NOT copy the dummy values (like 72, 85, "Summary", etc.). 
3. You MUST calculate REAL scores based on the actual resume provided.
4. If a resume is terrible, give it a low score (e.g. 20-40). If it is amazing, give it a high score (80-99).
5. Be highly critical and analytical.

Return this exact JSON structure:

{
  "candidateProfile": {
    "name": "Extract full name",
    "email": "extract email",
    "phone": "extract phone",
    "technicalSkills": ["extract real skill 1", "extract real skill 2"],
    "softSkills": ["extract soft skill 1"],
    "education": "Highest degree",
    "experienceLevel": "Entry/Mid/Senior",
    "yearsOfExperience": "Calculate years",
    "strengths": ["Real strength 1 based on resume"],
    "weaknesses": ["Real weakness based on resume"]
  },
  "jobRecommendations": [
    {
      "title": "Realistic Job Title",
      "matchScore": 85,
      "matchingSkills": ["skill1"],
      "explanation": "Why this role fits",
      "breakdown": {
        "skillsMatch": 80,
        "experienceMatch": 90,
        "projectRelevance": 75
      }
    }
  ],
  "jdMatch": {
    "score": 78,
    "requiredSkills": ["skill1"],
    "matchingSkills": ["skill1"],
    "missingSkills": ["skill2"],
    "explanation": "Detailed explanation"
  },
  "atsScore": {
    "overallScore": 75,
    "categories": [
      {
        "name": "CONTENT",
        "score": 90,
        "items": [
          { "text": "ATS Parse Rate", "passed": true },
          { "text": "Quantifying Impact", "passed": false },
          { "text": "Repetition", "passed": true }
        ]
      },
      {
        "name": "FORMAT & BREVITY",
        "score": 84,
        "items": [
          { "text": "Appropriate Length", "passed": true },
          { "text": "Consistent Formatting", "passed": false }
        ]
      },
      {
        "name": "STYLE",
        "score": 40,
        "items": [
          { "text": "Action Verbs", "passed": false },
          { "text": "Active Voice", "passed": true }
        ]
      },
      {
        "name": "SECTIONS",
        "score": 60,
        "items": [
          { "text": "Professional Summary", "passed": false },
          { "text": "Education Section", "passed": true },
          { "text": "Skills Section", "passed": true }
        ]
      },
      {
        "name": "SKILLS",
        "score": 68,
        "items": [
          { "text": "Hard Skills Match", "passed": false },
          { "text": "Soft Skills Match", "passed": true }
        ]
      }
    ]
  },
  "skillGap": {
    "coveragePercent": 68,
    "missingSkills": [
      { "skill": "Skill needed", "priority": "High" }
    ]
  },
  "learningPath": [
    { "step": 1, "topic": "Topic", "level": "Beginner", "resources": ["Resource"], "estimatedTime": "2 weeks" }
  ],
  "interviewPrep": [
    { "question": "Question?", "answer": "Answer" }
  ],
  "resumeImprover": [
    { "original": "Bad bullet from resume", "improved": "Better version" }
  ],
  "suggestions": {
    "skillsToImprove": ["Skill 1"],
    "resumeTips": ["Tip 1"]
  }
}

Rules:
- jobRecommendations must have exactly 5 items
- interviewPrep must have exactly 5 items
- resumeImprover must have exactly 3 items
- All scores (atsScore.overallScore, category scores, jdMatch.score, matchScore) MUST be calculated dynamically between 0 and 100 based on the resume quality.
- DO NOT just return 75 for ATS score. Calculate it!
- If jdMatch is not applicable, return: "jdMatch": {}`;
};

// ── Main analysis function ────────────────────────────────────────────────────
const analyzeResume = async (resumeText, jobDescription = '') => {
  const availableModels = await getAvailableModels();
  const prompt = buildPrompt(resumeText, jobDescription);
  let lastError = null;

  for (const modelName of availableModels) {
    try {
      console.log(`[Gemini] Attempting analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Strip markdown code fences if present
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

      const parsed = JSON.parse(text);
      console.log(`[Gemini] ✅ Success with model: ${modelName}`);
      return parsed;
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
      lastError = err;

      // If this model is deprecated/not-found (404), invalidate the cache
      // so the next request will re-fetch the live model list.
      if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
        console.warn('[Gemini] Deprecated model detected — invalidating model cache.');
        _cachedModels = null;
        _cacheTimestamp = 0;
      }

      // Continue to next model regardless of error type
    }
  }

  // All models failed — throw a user-friendly error
  if (lastError) {
    if (lastError.message.includes('429') || lastError.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please wait or upgrade your Google AI plan.');
    }
    if (lastError.message.includes('503')) {
      throw new Error('All AI models are experiencing high demand. Please try again in a few minutes.');
    }
    throw new Error('AI analysis failed after multiple attempts: ' + lastError.message);
  }
};

module.exports = { analyzeResume };
