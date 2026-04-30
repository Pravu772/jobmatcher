const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');

router.get('/generate-report/:id', generateReport);

module.exports = router;
