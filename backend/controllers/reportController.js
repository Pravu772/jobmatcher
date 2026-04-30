const PDFDocument = require('pdfkit');
const Analysis = require('../models/Analysis');

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

// GET /api/generate-report/:id
const generateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    let analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found.' });
    }
    
    // Normalize score to ensure PDF exactly matches the UI calculated score
    analysis = normalizeAtsScore(analysis.toObject());

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="JobMatcher-Report-${id}.pdf"`);
    doc.pipe(res);

    const BLUE = '#2563EB';
    const GREEN = '#16A34A';
    const RED = '#DC2626';
    const GRAY = '#6B7280';
    const DARK = '#111827';

    // ── Header ──────────────────────────────────────────────
    doc.fillColor(BLUE).fontSize(28).font('Helvetica-Bold').text('Job Matcher', 50, 50);
    doc.fontSize(12).font('Helvetica').fillColor(GRAY).text('AI-Powered Career Analysis Report');
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(BLUE).lineWidth(2).stroke();
    doc.moveDown(1.5);

    const section = (title) => {
      if (doc.y > doc.page.height - doc.page.margins.bottom - 150) {
        doc.addPage();
      } else {
        doc.moveDown(1.5);
      }
      doc.fillColor(BLUE).fontSize(16).font('Helvetica-Bold').text(title);
      doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor('#E5E7EB').lineWidth(1).stroke();
      doc.moveDown(1);
      doc.fillColor(DARK);
    };

    const row = (label, value) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK).text(label + ': ', { continued: true });
      doc.font('Helvetica').fillColor(GRAY).text(String(value || 'N/A'));
    };

    const scoreBar = (label, score) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(DARK).text(`${label}: ${score}/100`);
      const barWidth = 400;
      const fillWidth = Math.round((score / 100) * barWidth);
      doc.rect(50, doc.y, barWidth, 8).stroke('#E5E7EB');
      doc.rect(50, doc.y, fillWidth, 8).fill(score >= 70 ? GREEN : score >= 40 ? '#CA8A04' : RED);
      doc.moveDown(1.5);
    };

    // ── Candidate Profile ────────────────────────────
    section('Candidate Profile');
    const cp = analysis.candidateProfile || {};
    row('Name', cp.name);
    row('Email', cp.email);
    row('Phone', cp.phone);
    row('Education', cp.education);
    row('Experience Level', cp.experienceLevel);
    row('Years of Experience', cp.yearsOfExperience);
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillColor(DARK).text('Technical Skills: ');
    doc.font('Helvetica').fillColor(GRAY).text((cp.technicalSkills || []).join(', ') || 'N/A');
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillColor(DARK).text('Strengths: ');
    doc.font('Helvetica').fillColor(GREEN).text((cp.strengths || []).join(', ') || 'N/A');
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillColor(DARK).text('Weaknesses: ');
    doc.font('Helvetica').fillColor(RED).text((cp.weaknesses || []).join(', ') || 'N/A');

    // ── ATS Score ────────────────────────────────────
    section('ATS Score Simulation');
    const ats = analysis.atsScore || {};
    scoreBar('Overall ATS Score', ats.overallScore || 0);
    if (ats.categories && ats.categories.length > 0) {
      ats.categories.forEach(cat => {
        doc.font('Helvetica-Bold').fillColor(DARK).fontSize(10).text(`${cat.name} (${cat.score}%)`);
        cat.items.forEach(item => {
           const icon = item.passed ? '[Pass]' : '[Fail]';
           const color = item.passed ? GREEN : RED;
           doc.font('Helvetica').fillColor(color).fontSize(10).text(`  ${icon} `, { continued: true }).fillColor(GRAY).text(item.text);
        });
        doc.moveDown(0.5);
      });
    }

    // ── Job Recommendations ──────────────────────────
    section('Job Recommendations');
    (analysis.jobRecommendations || []).forEach((job, i) => {
      doc.font('Helvetica-Bold').fillColor(BLUE).fontSize(12).text(`${i + 1}. ${job.title} — ${job.matchScore}% Match`);
      doc.font('Helvetica').fillColor(GRAY).fontSize(10).text(job.explanation || '');
      doc.fontSize(10).fillColor(GREEN).text('Skills: ' + (job.matchingSkills || []).join(', '));
      doc.moveDown(0.8);
    });

    // ── JD Match ─────────────────────────────────────
    section('Job Description Match');
    const jd = analysis.jdMatch || {};
    if (jd.score !== undefined) {
      scoreBar('JD Match Score', jd.score || 0);
      doc.font('Helvetica-Bold').fillColor(GREEN).fontSize(11).text('Matching Skills: ');
      doc.font('Helvetica').fillColor(GRAY).text((jd.matchingSkills || []).join(', ') || 'None');
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fillColor(RED).text('Missing Skills: ');
      doc.font('Helvetica').fillColor(GRAY).text((jd.missingSkills || []).join(', ') || 'None');
      doc.moveDown(0.5);
      doc.font('Helvetica').fillColor(DARK).text(jd.explanation || '');
    } else {
      doc.font('Helvetica').fillColor(GRAY).text('No Job Description was provided for this analysis.');
    }

    // ── Skill Gap ────────────────────────────────────
    section('Skill Gap Analysis');
    const sg = analysis.skillGap || {};
    scoreBar('Skill Coverage', sg.coveragePercent || 0);
    (sg.missingSkills || []).forEach((s) => {
      const color = s.priority === 'High' ? RED : s.priority === 'Medium' ? '#CA8A04' : GRAY;
      doc.font('Helvetica-Bold').fillColor(color).fontSize(10).text(`• [${s.priority}] `, { continued: true }).font('Helvetica').text(s.skill);
    });

    // ── Learning Path ────────────────────────────────
    section('Learning Path');
    (analysis.learningPath || []).forEach((step) => {
      doc.font('Helvetica-Bold').fillColor(DARK).fontSize(11).text(`Step ${step.step}: ${step.topic} (${step.level})`);
      doc.font('Helvetica').fillColor(GRAY).fontSize(10).text(`  Time: ${step.estimatedTime} | Resources: ${(step.resources || []).join(', ')}`);
      doc.moveDown(0.5);
    });

    // ── Interview Prep ───────────────────────────────
    section('Interview Preparation');
    (analysis.interviewPrep || []).forEach((qa, i) => {
      doc.font('Helvetica-Bold').fillColor(DARK).fontSize(11).text(`Q${i + 1}: ${qa.question}`);
      doc.font('Helvetica').fillColor(GRAY).fontSize(10).text(`A: ${qa.answer}`);
      doc.moveDown(0.8);
    });

    // ── Resume Improver ──────────────────────────────
    section('Resume Improver');
    (analysis.resumeImprover || []).forEach((item, i) => {
      doc.font('Helvetica-Bold').fillColor(RED).fontSize(10).text(`Original ${i + 1}: `);
      doc.font('Helvetica').fillColor(GRAY).text(item.original);
      doc.font('Helvetica-Bold').fillColor(GREEN).text('Improved: ');
      doc.font('Helvetica').fillColor(DARK).text(item.improved);
      doc.moveDown(0.8);
    });

    // ── Suggestions ──────────────────────────────────
    section('Suggestions');
    const sugg = analysis.suggestions || {};
    doc.font('Helvetica-Bold').fillColor(DARK).fontSize(11).text('Skills to Improve:');
    (sugg.skillsToImprove || []).forEach((s) => doc.font('Helvetica').fillColor(GRAY).fontSize(10).text(`  • ${s}`));
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillColor(DARK).fontSize(11).text('Resume Tips:');
    (sugg.resumeTips || []).forEach((t) => doc.font('Helvetica').fillColor(GRAY).fontSize(10).text(`  • ${t}`));

    // ── Footer ───────────────────────────────────────────────
    doc.page.margins.bottom = 0; // Prevent footer from causing a page break
    doc.fontSize(9).fillColor(GRAY).text(
      `Generated by Job matcher • ${new Date().toLocaleDateString()} • © 2026 Job matcher. All rights reserved.`,
      50,
      doc.page.height - 40,
      { align: 'center', width: doc.page.width - 100 }
    );
    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { generateReport };
