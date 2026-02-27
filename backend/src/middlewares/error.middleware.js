function notFoundHandler(req, res, _next) {
  return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: 'Validation failed', details });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  return res.status(500).json({ message: 'Internal server error', details: err.message });
}

module.exports = { notFoundHandler, errorHandler };
