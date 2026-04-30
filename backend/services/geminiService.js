const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = (resumeText, jobDescription = '') => {
  const jdSection = jobDescription
    ? `JOB DESCRIPTION PROVIDED:\n${jobDescription}`
    : 'NO JOB DESCRIPTION PROVIDED - skip jdMatch analysis, return empty jdMatch object.';

  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

const analyzeResume = async (resumeText, jobDescription = '') => {
  // Array of models to try in sequence if one fails due to 503 overload
  const fallbackModels = [
    'gemini-flash-latest',
    'gemma-3-27b-it',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash-latest'
  ];

  const prompt = buildPrompt(resumeText, jobDescription);
  let lastError = null;

  for (const modelName of fallbackModels) {
    try {
      console.log(`[Gemini] Attempting analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0, // Force deterministic output so same resume gets same score
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Strip markdown code fences if present
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

      const parsed = JSON.parse(text);
      return parsed; // Success! Return the parsed JSON
    } catch (err) {
      console.warn(`[Gemini] Model ${modelName} failed:`, err.message);
      lastError = err;
      
      // If it's a 503 (Overloaded) or 429 (Quota), try the next model.
      // If it's a 400 (Bad Request) or parsing error, it's likely a prompt issue, but we'll retry anyway just in case the model hallucinated.
      if (err.message.includes('404')) {
        // 404 means the model doesn't exist for this API key, safe to try the next one.
        continue;
      }
    }
  }

  // If all models fail, throw a clean error based on the last failure
  if (lastError) {
    if (lastError.message.includes('429') || lastError.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded across all available models. Please wait until tomorrow or upgrade your Google AI plan.');
    }
    if (lastError.message.includes('503')) {
      throw new Error('All AI models are currently experiencing high demand. Please try again in a few minutes.');
    }
    throw new Error('AI analysis failed after multiple attempts: ' + lastError.message);
  }
};

module.exports = { analyzeResume };
