function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  if (status >= 500) {
    console.error('Unhandled error:', err)
  }

  return res.status(status).json({ message })
}

module.exports = errorHandler
