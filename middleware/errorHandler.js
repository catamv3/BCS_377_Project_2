// middleware/errorHandler.js

// Handle errors
module.exports = function(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  res.status(status);

  // Send JSON for API routes
  if (req.path.startsWith('/api/')) {
    res.json({ message: err.message || 'Server error' });
  } else {
    // Render error page for regular pages
    res.render('pages/not-found', {
      title: 'Error',
      message: err.message
    });
  }
};
