const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')
const { createToken } = require('../utils/jwt')

async function signup(req, res, next) {
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
  } catch (error) {
    const wrappedError = new Error('Failed to sign up.')
    wrappedError.statusCode = 500
    wrappedError.cause = error
    return next(wrappedError)
  }
}

async function login(req, res, next) {
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
  } catch (error) {
    const wrappedError = new Error('Failed to log in.')
    wrappedError.statusCode = 500
    wrappedError.cause = error
    return next(wrappedError)
  }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.json({ user })
  } catch (error) {
    const wrappedError = new Error('Failed to load user.')
    wrappedError.statusCode = 500
    wrappedError.cause = error
    return next(wrappedError)
  }
}

module.exports = {
  signup,
  login,
  me,
}
