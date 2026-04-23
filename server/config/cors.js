const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  ...String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  CLIENT_ORIGIN,
])

function isRenderOrigin(origin) {
  return /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(String(origin || ''))
}

function corsOrigin(origin, callback) {
  const isLocalhostOrigin = /^http:\/\/localhost:\d+$/.test(String(origin || ''))
  const allowRenderOrigin = process.env.NODE_ENV === 'production' && isRenderOrigin(origin)

  if (!origin || isLocalhostOrigin || allowedOrigins.has(origin) || allowRenderOrigin) {
    return callback(null, true)
  }

  return callback(new Error('Not allowed by CORS'))
}

const corsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = { corsOptions }
