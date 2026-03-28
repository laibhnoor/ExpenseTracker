const prisma = require('../config/prisma')
const {
  normalizeType,
  normalizeCategory,
  mapTransactionToClient,
} = require('../utils/transactions')

async function createTransaction(req, res, next) {
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
  } catch (error) {
    const wrappedError = new Error('Failed to add transaction.')
    wrappedError.statusCode = 500
    wrappedError.cause = error
    return next(wrappedError)
  }
}

async function listTransactions(req, res, next) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' },
    })

    return res.json({
      transactions: transactions.map(mapTransactionToClient),
    })
  } catch (error) {
    const wrappedError = new Error('Failed to load transactions.')
    wrappedError.statusCode = 500
    wrappedError.cause = error
    return next(wrappedError)
  }
}

module.exports = {
  createTransaction,
  listTransactions,
}
