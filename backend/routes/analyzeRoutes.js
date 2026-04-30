const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadResume, analyze, matchJD } = require('../controllers/analyzeController');
const { protect } = require('../middleware/auth');

router.post('/upload-resume', protect, upload.single('resume'), uploadResume);
router.post('/analyze', protect, analyze);
router.post('/match-jd', protect, matchJD);

module.exports = router;
