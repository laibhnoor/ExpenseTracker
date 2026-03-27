import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const redirectPath = location.state?.from ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!formData.email || !formData.password) {
      return
    }

    login({ email: formData.email })
    navigate(redirectPath, { replace: true })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <section className="fade-up w-full max-w-md rounded-3xl border border-white/70 bg-white/70 p-7 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:p-9">
        <h1 className="text-4xl text-slate-900">Welcome Back</h1>
        <p className="mt-2 text-slate-600">
          Sign in to continue managing your expenses.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-black"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          New user?{' '}
          <Link to="/signup" className="font-semibold text-sky-600 transition hover:text-sky-700">
            Create account
          </Link>
        </p>

        <Link to="/" className="mt-4 inline-block text-sm font-medium text-slate-500 hover:text-slate-900">
          Back to Home
        </Link>
      </section>
    </main>
  )
}

export default LoginPage
