import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MOCK_DATA = {
  month: 'March 2026',
  income: 5400,
  expenses: 3675,
  categories: [
    { name: 'Rent', amount: 1600, color: '#334155' },
    { name: 'Food', amount: 840, color: '#0ea5e9' },
    { name: 'Transport', amount: 430, color: '#10b981' },
    { name: 'Shopping', amount: 515, color: '#fb923c' },
    { name: 'Utilities', amount: 290, color: '#6366f1' },
  ],
  transactions: [
    {
      id: 1,
      amount: 1200,
      type: 'Expense',
      category: 'Food',
      date: '2026-03-25',
      notes: 'Groceries for the week',
    },
    {
      id: 2,
      amount: 5000,
      type: 'Income',
      category: 'Salary',
      date: '2026-03-01',
      notes: 'Monthly salary',
    },
    {
      id: 3,
      amount: 1600,
      type: 'Expense',
      category: 'Rent',
      date: '2026-03-03',
      notes: 'Apartment rent',
    },
    {
      id: 4,
      amount: 430,
      type: 'Expense',
      category: 'Travel',
      date: '2026-03-12',
      notes: 'Fuel and tolls',
    },
    {
      id: 5,
      amount: 700,
      type: 'Income',
      category: 'Other',
      date: '2026-03-18',
      notes: 'Freelance payment',
    },
    {
      id: 6,
      amount: 515,
      type: 'Expense',
      category: 'Other',
      date: '2026-03-20',
      notes: 'Shopping and essentials',
    },
    {
      id: 7,
      amount: 260,
      type: 'Expense',
      category: 'Travel',
      date: '2026-03-08',
      notes: '',
    },
    {
      id: 8,
      amount: 1100,
      type: 'Expense',
      category: 'Food',
      date: '2026-03-26',
      notes: 'Family dinner and snacks',
    },
  ],
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

function SummaryCard({ label, value, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xl shadow-slate-700/10 transition duration-300 hover:-translate-y-0.5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </article>
  )
}

function TopCategoryCard({ category }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-700/10">
      <h2 className="text-2xl text-slate-900">Top Spending Category</h2>
      <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-100/80 p-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">{category.name}</p>
          <p className="text-sm text-slate-500">Largest spend this month</p>
        </div>
        <p className="text-2xl font-semibold text-slate-900">
          {formatCurrency(category.amount)}
        </p>
      </div>
    </section>
  )
}

function GraphCard({ categories, total }) {
  const chartBackground = useMemo(() => {
    let start = 0
    const stops = categories
      .map((item) => {
        const size = (item.amount / total) * 100
        const segment = `${item.color} ${start}% ${start + size}%`
        start += size
        return segment
      })
      .join(', ')

    return `conic-gradient(${stops})`
  }, [categories, total])

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-700/10">
      <h2 className="text-2xl text-slate-900">Category Breakdown</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        <div
          className="mx-auto h-44 w-44 rounded-full border-8 border-white shadow-lg"
          style={{ background: chartBackground }}
          aria-label="Pie chart of monthly expense categories"
          role="img"
        />

        <ul className="space-y-3">
          {categories.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between rounded-lg bg-slate-100/80 px-3 py-2"
            >
              <span className="flex items-center gap-2 text-slate-700">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-2xl bg-white/70" />
        ))}
      </div>
      <div className="h-36 rounded-2xl bg-white/70" />
      <div className="h-64 rounded-2xl bg-white/70" />
    </div>
  )
}

function FilterBar({
  filters,
  onFilterChange,
  onSortChange,
  categories,
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xl shadow-slate-700/10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          value={filters.type}
          onChange={(event) => onFilterChange('type', event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => onFilterChange('category', event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => onFilterChange('startDate', event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          aria-label="Start date"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => onFilterChange('endDate', event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          aria-label="End date"
        />

        <select
          value={filters.sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="date-desc">Date (Latest first)</option>
          <option value="amount-asc">Amount (Low to high)</option>
          <option value="amount-desc">Amount (High to low)</option>
        </select>
      </div>
    </section>
  )
}

function TransactionCard({ transaction }) {
  const isIncome = transaction.type === 'Income'

  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-md shadow-slate-700/10 transition duration-300 hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`text-xl font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatCurrency(transaction.amount)}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isIncome
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {transaction.type}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
        <p>
          <span className="font-semibold text-slate-800">Category:</span> {transaction.category}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Date:</span> {formatDate(transaction.date)}
        </p>
        <p className="sm:text-right">
          <span className="font-semibold text-slate-800">Notes:</span>{' '}
          {transaction.notes || 'No notes'}
        </p>
      </div>
    </article>
  )
}

function TransactionList({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-500">
        No transactions match your selected filters.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  )
}

function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [filters, setFilters] = useState({
    type: 'All',
    category: 'All',
    startDate: '',
    endDate: '',
    sortBy: 'date-desc',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA)
      setTransactions(MOCK_DATA.transactions)
      setLoading(false)
    }, 900)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const message = location.state?.toast
    const newTransaction = location.state?.newTransaction
    if (newTransaction) {
      setTransactions((previous) => [newTransaction, ...previous])
    }

    if (!message) {
      if (newTransaction) {
        navigate(location.pathname, { replace: true, state: null })
      }
      return
    }

    setToastMessage(message)
    navigate(location.pathname, { replace: true, state: null })

    const timer = setTimeout(() => {
      setToastMessage('')
    }, 2400)

    return () => clearTimeout(timer)
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const totalExpenses = data?.expenses ?? 0
  const balance = data ? data.income - data.expenses : 0
  const topCategory = data?.categories?.reduce(
    (top, current) => (current.amount > top.amount ? current : top),
    data?.categories?.[0] ?? { name: '-', amount: 0 },
  )

  const availableCategories = useMemo(
    () => [...new Set(transactions.map((item) => item.category))],
    [transactions],
  )

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((item) => {
      if (filters.type !== 'All' && item.type !== filters.type) {
        return false
      }

      if (filters.category !== 'All' && item.category !== filters.category) {
        return false
      }

      if (filters.startDate && item.date < filters.startDate) {
        return false
      }

      if (filters.endDate && item.date > filters.endDate) {
        return false
      }

      return true
    })

    return filtered.sort((first, second) => {
      if (filters.sortBy === 'amount-asc') {
        return first.amount - second.amount
      }

      if (filters.sortBy === 'amount-desc') {
        return second.amount - first.amount
      }

      return new Date(second.date) - new Date(first.date)
    })
  }, [filters, transactions])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize)

  function handleFilterChange(field, value) {
    setFilters((previous) => ({ ...previous, [field]: value }))
  }

  function handleSortChange(value) {
    setFilters((previous) => ({ ...previous, sortBy: value }))
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />

      <section className="fade-up relative z-10 mx-auto w-full max-w-6xl rounded-3xl border border-white/60 bg-white/60 p-6 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-8 lg:p-10">
        {toastMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {toastMessage}
          </div>
        ) : null}

        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl text-slate-900 sm:text-5xl">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Monthly overview for {data?.month ?? 'your latest period'}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/add-transaction"
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition duration-300 hover:bg-black"
            >
              Add Transaction
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 font-semibold text-slate-700 transition duration-300 hover:border-slate-500"
            >
              Log Out
            </button>
            <Link
              to="/"
              className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 font-semibold text-slate-700 transition duration-300 hover:border-slate-500"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Income"
                value={formatCurrency(data.income)}
                accent="text-emerald-600"
              />
              <SummaryCard
                label="Expenses"
                value={formatCurrency(totalExpenses)}
                accent="text-slate-900"
              />
              <SummaryCard
                label="Balance"
                value={formatCurrency(balance)}
                accent={balance >= 0 ? 'text-sky-600' : 'text-rose-600'}
              />
            </section>

            <TopCategoryCard category={topCategory} />
            <GraphCard categories={data.categories} total={totalExpenses} />

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl text-slate-900">Transactions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Filter by type, category, and date range. Sort by amount or latest date.
                </p>
              </div>

              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                categories={availableCategories}
              />

              <TransactionList transactions={paginatedTransactions} />

              <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600">
                <p>
                  Showing {filteredTransactions.length ? startIndex + 1 : 0}-
                  {Math.min(startIndex + pageSize, filteredTransactions.length)} of{' '}
                  {filteredTransactions.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                    disabled={safePage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((previous) => Math.min(totalPages, previous + 1))
                    }
                    disabled={safePage === totalPages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
