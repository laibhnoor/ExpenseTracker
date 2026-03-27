import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const { signup, isAuthenticated, initialized } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (initialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Signup failed. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <section className="fade-up w-full max-w-md rounded-3xl border border-white/70 bg-white/70 p-7 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-9">
        <h1 className="text-4xl text-slate-900">Create Your Account</h1>
        <p className="mt-2 text-slate-600">
          Start tracking spending in under one minute.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Full Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose password"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-orange-400 px-5 py-3 font-semibold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-300"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>

          {errorMessage ? (
            <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
          ) : null}
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 transition hover:text-sky-700">
            Log in
          </Link>
        </p>

        <Link to="/" className="mt-4 inline-block text-sm font-medium text-slate-500 hover:text-slate-900">
          Back to Home
        </Link>
      </section>
    </main>
  )
}

export default SignupPage
