const pdfParse = require('pdf-parse');
const crypto = require('crypto');
const { analyzeResume } = require('../services/geminiService');
const Analysis = require('../models/Analysis');

// POST /api/upload-resume
const uploadResume = async (req, res, next) => {
  try {
    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, error: 'Resume is too short or empty. Please provide a valid resume.' });
    }

    res.json({ success: true, resumeText: resumeText.trim(), charCount: resumeText.length });
  } catch (err) {
    next(err);
  }
};

const generateHash = (resumeText, jdText) => {
  return crypto.createHash('sha256').update(`${resumeText}|${jdText}`).digest('hex');
};

const normalizeAtsScore = (data) => {
  if (data && data.atsScore && Array.isArray(data.atsScore.categories)) {
    let totalScore = 0;
    let validCategories = 0;
    data.atsScore.categories.forEach(cat => {
      if (Array.isArray(cat.items) && cat.items.length > 0) {
        const passedCount = cat.items.filter(i => i.passed).length;
        cat.score = Math.round((passedCount / cat.items.length) * 100);
        totalScore += cat.score;
        validCategories++;
      }
    });
    if (validCategories > 0) {
      data.atsScore.overallScore = Math.round(totalScore / validCategories);
    }
  }
  return data;
};

// POST /api/analyze
const analyze = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, error: 'Resume text is required and must be at least 50 characters.' });
    }

    const trimmedResumeText = resumeText.trim();
    const trimmedJD = jobDescription ? jobDescription.trim() : '';
    const documentHash = generateHash(trimmedResumeText, trimmedJD);

    // Check cache
    const existingAnalysis = await Analysis.findOne({ documentHash });
    if (existingAnalysis) {
      console.log('✅ Found existing analysis in DB, returning cached result.');
      const normalizedData = normalizeAtsScore(existingAnalysis.toObject());
      return res.json({ success: true, analysisId: existingAnalysis._id, data: normalizedData });
    }

    console.log('🔍 Starting AI analysis...');
    let aiResult = await analyzeResume(trimmedResumeText, trimmedJD);
    aiResult = normalizeAtsScore(aiResult);

    // Save to MongoDB
    const analysis = new Analysis({
      documentHash,
      resumeText: trimmedResumeText,
      jobDescription: trimmedJD,
      candidateProfile: aiResult.candidateProfile || {},
      jobRecommendations: aiResult.jobRecommendations || [],
      jdMatch: aiResult.jdMatch || {},
      atsScore: aiResult.atsScore || {},
      skillGap: aiResult.skillGap || {},
      learningPath: aiResult.learningPath || [],
      interviewPrep: aiResult.interviewPrep || [],
      resumeImprover: aiResult.resumeImprover || [],
      suggestions: aiResult.suggestions || {},
    });

    await analysis.save();
    console.log('✅ Analysis saved, ID:', analysis._id);

    res.json({ success: true, analysisId: analysis._id, data: aiResult });
  } catch (err) {
    next(err);
  }
};

// POST /api/match-jd
const matchJD = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, error: 'Resume text is required.' });
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, error: 'Job description is required for JD matching.' });
    }

    const trimmedResumeText = resumeText.trim();
    const trimmedJD = jobDescription.trim();
    const documentHash = generateHash(trimmedResumeText, trimmedJD);

    // Check cache
    const existingAnalysis = await Analysis.findOne({ documentHash });
    if (existingAnalysis) {
      console.log('✅ Found existing analysis for JD Match in DB, returning cached result.');
      return res.json({ success: true, jdMatch: existingAnalysis.jdMatch });
    }

    console.log('🔍 Starting AI analysis for JD Match...');
    const aiResult = await analyzeResume(trimmedResumeText, trimmedJD);

    // Save full analysis to DB for future caching
    const analysis = new Analysis({
      documentHash,
      resumeText: trimmedResumeText,
      jobDescription: trimmedJD,
      candidateProfile: aiResult.candidateProfile || {},
      jobRecommendations: aiResult.jobRecommendations || [],
      jdMatch: aiResult.jdMatch || {},
      atsScore: aiResult.atsScore || {},
      skillGap: aiResult.skillGap || {},
      learningPath: aiResult.learningPath || [],
      interviewPrep: aiResult.interviewPrep || [],
      resumeImprover: aiResult.resumeImprover || [],
      suggestions: aiResult.suggestions || {},
    });

    await analysis.save();

    res.json({ success: true, jdMatch: aiResult.jdMatch });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadResume, analyze, matchJD };
