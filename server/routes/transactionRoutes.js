const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {
  createTransaction,
  listTransactions,
} = require('../controllers/transactionController')

const router = express.Router()

router.post('/', authMiddleware, createTransaction)
router.get('/', authMiddleware, listTransactions)

module.exports = router
