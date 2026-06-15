const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/generate-report/:id', protect, generateReport);

module.exports = router;
