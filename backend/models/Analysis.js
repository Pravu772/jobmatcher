const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    documentHash: { type: String, index: true },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, default: '' },
    candidateProfile: {
      name: String,
      email: String,
      phone: String,
      technicalSkills: [String],
      softSkills: [String],
      education: String,
      experienceLevel: String,
      yearsOfExperience: String,
      strengths: [String],
      weaknesses: [String],
    },
    jobRecommendations: [
      {
        title: String,
        matchScore: Number,
        matchingSkills: [String],
        explanation: String,
        breakdown: {
          skillsMatch: Number,
          experienceMatch: Number,
          projectRelevance: Number,
        },
      },
    ],
    jdMatch: {
      score: Number,
      requiredSkills: [String],
      matchingSkills: [String],
      missingSkills: [String],
      explanation: String,
    },
    atsScore: {
      overallScore: Number,
      categories: [
        {
          name: String,
          score: Number,
          items: [
            {
              text: String,
              passed: Boolean,
            }
          ]
        }
      ]
    },
    skillGap: {
      coveragePercent: Number,
      missingSkills: [
        {
          skill: String,
          priority: { type: String, enum: ['High', 'Medium', 'Low'] },
        },
      ],
    },
    learningPath: [
      {
        step: Number,
        topic: String,
        level: String,
        resources: [String],
        estimatedTime: String,
      },
    ],
    interviewPrep: [
      {
        question: String,
        answer: String,
      },
    ],
    resumeImprover: [
      {
        original: String,
        improved: String,
      },
    ],
    suggestions: {
      skillsToImprove: [String],
      resumeTips: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', analysisSchema);
