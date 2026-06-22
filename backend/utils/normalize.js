/**
 * Shared utility: normalize ATS score categories so each category's
 * score and the overall score are always calculated consistently.
 * Used by both analyzeController.js and reportController.js.
 */
const normalizeAtsScore = (data) => {
  if (data && data.atsScore && Array.isArray(data.atsScore.categories)) {
    let totalScore = 0;
    let validCategories = 0;
    data.atsScore.categories.forEach((cat) => {
      if (Array.isArray(cat.items) && cat.items.length > 0) {
        const passedCount = cat.items.filter((i) => i.passed).length;
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

module.exports = { normalizeAtsScore };
