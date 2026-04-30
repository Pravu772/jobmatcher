const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large. Maximum size is 10MB.' });
  }

  if (err.message === 'Only PDF and text files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error. Please try again.',
  });
};

module.exports = errorHandler;
