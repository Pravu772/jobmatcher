const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'text/plain'];
  const isAllowedMime = allowedMimes.includes(file.mimetype);
  const isAllowedExt = file.originalname.toLowerCase().endsWith('.pdf') || file.originalname.toLowerCase().endsWith('.txt');

  if (isAllowedMime || isAllowedExt) {
    // If it's a PDF by extension but the browser sent a generic mime, force it to application/pdf so analyzeController parses it correctly
    if (file.originalname.toLowerCase().endsWith('.pdf')) {
      file.mimetype = 'application/pdf';
    }
    cb(null, true);
  } else {
    cb(new Error('Only PDF and text files are allowed. Please ensure your file has a .pdf extension.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

module.exports = upload;
