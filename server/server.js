require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const app = express()
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const PORT = Number(process.env.PORT || 5000)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

const allowedOrigins = new Set([
	'http://localhost:5173',
	'http://localhost:5174',
	...String(process.env.ALLOWED_ORIGINS || '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean),
	CLIENT_ORIGIN,
])

function corsOrigin(origin, callback) {
	const isLocalhostOrigin = /^http:\/\/localhost:\d+$/.test(String(origin || ''))

	if (!origin || isLocalhostOrigin || allowedOrigins.has(origin)) {
		return callback(null, true)
	}

	return callback(new Error('Not allowed by CORS'))
}

const corsOptions = {
	origin: corsOrigin,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())

function createToken(user) {
	return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: '7d',
	})
}

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const token = authHeader.slice(7)
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		req.user = payload
		return next()
	} catch {
		return res.status(401).json({ message: 'Invalid token' })
	}
}

const categoryMap = {
	Food: 'FOOD',
	Rent: 'RENT',
	Travel: 'TRAVEL',
	Salary: 'SALARY',
	Other: 'OTHER',
}

function normalizeType(input) {
	const value = String(input || '').toUpperCase()
	if (value === 'INCOME') {
		return 'INCOME'
	}
	if (value === 'EXPENSE') {
		return 'EXPENSE'
	}
	return null
}

function normalizeCategory(input) {
	if (!input) {
		return null
	}

	if (categoryMap[input]) {
		return categoryMap[input]
	}

	const upper = String(input).toUpperCase()
	if (Object.values(categoryMap).includes(upper)) {
		return upper
	}

	return null
}

function mapTransactionToClient(transaction) {
	const categoryLabel =
		Object.keys(categoryMap).find((key) => categoryMap[key] === transaction.category) ||
		transaction.category

	return {
		id: transaction.id,
		amount: transaction.amount,
		type: transaction.type === 'INCOME' ? 'Income' : 'Expense',
		category: categoryLabel,
		date: transaction.date.toISOString().slice(0, 10),
		notes: transaction.notes || '',
	}
}

app.get('/api/health', (_req, res) => {
	return res.json({ ok: true })
})

app.post('/api/auth/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body

		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Name, email, and password are required.' })
		}

		const normalizedEmail = String(email).toLowerCase().trim()
		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		})

		if (existingUser) {
			return res.status(409).json({ message: 'Email already registered.' })
		}

		const passwordHash = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({
			data: {
				name: String(name).trim(),
				email: normalizedEmail,
				passwordHash,
			},
		})

		const token = createToken(user)

		return res.status(201).json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		})
	} catch {
		return res.status(500).json({ message: 'Failed to sign up.' })
	}
})

app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required.' })
		}

		const normalizedEmail = String(email).toLowerCase().trim()
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		})

		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password.' })
		}

		const passwordMatches = await bcrypt.compare(password, user.passwordHash)
		if (!passwordMatches) {
			return res.status(401).json({ message: 'Invalid email or password.' })
		}

		const token = createToken(user)

		return res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		})
	} catch {
		return res.status(500).json({ message: 'Failed to log in.' })
	}
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.userId },
			select: { id: true, name: true, email: true },
		})

		if (!user) {
			return res.status(404).json({ message: 'User not found.' })
		}

		return res.json({ user })
	} catch {
		return res.status(500).json({ message: 'Failed to load user.' })
	}
})

app.post('/api/transactions', authMiddleware, async (req, res) => {
	try {
		const { amount, type, category, date, notes } = req.body

		const numericAmount = Number(amount)
		const normalizedType = normalizeType(type)
		const normalizedCategory = normalizeCategory(category)

		if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
			return res.status(400).json({ message: 'Amount must be greater than 0.' })
		}

		if (!normalizedType) {
			return res.status(400).json({ message: 'Type must be Income or Expense.' })
		}

		if (!normalizedCategory) {
			return res.status(400).json({ message: 'Please select a valid category.' })
		}

		if (!date) {
			return res.status(400).json({ message: 'Date is required.' })
		}

		const transactionDate = new Date(date)
		if (Number.isNaN(transactionDate.getTime())) {
			return res.status(400).json({ message: 'Invalid date.' })
		}

		const transaction = await prisma.transaction.create({
			data: {
				amount: numericAmount,
				type: normalizedType,
				category: normalizedCategory,
				date: transactionDate,
				notes: notes?.trim() || null,
				userId: req.user.userId,
			},
		})

		return res.status(201).json({
			message: 'Transaction added successfully',
			transaction: mapTransactionToClient(transaction),
		})
	} catch {
		return res.status(500).json({ message: 'Failed to add transaction.' })
	}
})

app.get('/api/transactions', authMiddleware, async (req, res) => {
	try {
		const transactions = await prisma.transaction.findMany({
			where: { userId: req.user.userId },
			orderBy: { date: 'desc' },
		})

		return res.json({
			transactions: transactions.map(mapTransactionToClient),
		})
	} catch {
		return res.status(500).json({ message: 'Failed to load transactions.' })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
