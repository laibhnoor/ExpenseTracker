require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const { corsOptions } = require('./config/cors')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const requestLogger = require('./middleware/requestLogger')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const app = express()

const PORT = Number(process.env.PORT || 5000)

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())
app.use(requestLogger)

app.get('/api/health', (_req, res) => {
	return res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

if (process.env.NODE_ENV === 'production') {
	const clientDistPath = path.join(__dirname, '..', 'client', 'dist')

	app.use(express.static(clientDistPath))

	app.get(/^(?!\/api).*/, (_req, res) => {
		return res.sendFile(path.join(clientDistPath, 'index.html'))
	})
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
