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

module.exports = {
  normalizeType,
  normalizeCategory,
  mapTransactionToClient,
}
