import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const categoryOptions = ['Food', 'Rent', 'Travel', 'Salary', 'Other']

function AddTransactionPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    date: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  function validate() {
    const nextErrors = {}
    const amount = Number(formData.amount)

    if (!amount || amount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.'
    }

    if (!formData.category) {
      nextErrors.category = 'Please select a category.'
    }

    if (!formData.date) {
      nextErrors.date = 'Please select a date.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await api.post('/transactions', {
        amount: Number(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
      })

      navigate('/dashboard', {
        state: {
          toast: response.data.message || 'Transaction added successfully',
          newTransaction: response.data.transaction,
        },
      })
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || 'Failed to add transaction. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    navigate('/dashboard')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />

      <section className="fade-up relative z-10 w-full max-w-2xl rounded-3xl border border-white/60 bg-white/65 p-6 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-8">
        <h1 className="text-4xl text-slate-900 sm:text-5xl">Add Transaction</h1>
        <p className="mt-2 text-slate-600">
          Log an income or expense for your monthly summary.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Amount</label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
            {errors.amount ? <p className="mt-1 text-sm text-rose-600">{errors.amount}</p> : null}
          </div>

          <div>
            <p className="mb-1 block text-sm font-medium text-slate-600">Type</p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {['Income', 'Expense'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData((previous) => ({ ...previous, type: option }))}
                  className={`rounded-lg px-4 py-2 font-medium transition duration-300 ${
                    formData.type === option
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? <p className="mt-1 text-sm text-rose-600">{errors.category}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              {errors.date ? <p className="mt-1 text-sm text-rose-600">{errors.date}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Notes (optional)</label>
            <input
              name="notes"
              type="text"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Short note about this transaction"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3 font-semibold text-slate-700 transition duration-300 hover:border-slate-500"
            >
              Cancel
            </button>
          </div>

          {submitError ? (
            <p className="text-sm font-medium text-rose-600">{submitError}</p>
          ) : null}
        </form>
      </section>
    </main>
  )
}

export default AddTransactionPage
