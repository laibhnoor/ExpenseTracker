import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { AUTH_STORAGE_KEY } from '../lib/api'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!savedAuth) {
      setInitialized(true)
      return
    }

    try {
      const parsed = JSON.parse(savedAuth)
      setUser(parsed.user ?? null)
      setToken(parsed.token ?? '')
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }

    setInitialized(true)
  }, [])

  function persistAuth(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    )
  }

  async function login(payload) {
    const response = await api.post('/auth/login', {
      email: payload.email,
      password: payload.password,
    })

    persistAuth(response.data.token, response.data.user)
    return response.data.user
  }

  async function signup(payload) {
    const response = await api.post('/auth/signup', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    })

    persistAuth(response.data.token, response.data.user)
    return response.data.user
  }

  async function refreshMe() {
    if (!token) {
      return null
    }

    try {
      const response = await api.get('/auth/me')
      persistAuth(token, response.data.user)
      return response.data.user
    } catch {
      logout()
      return null
    }
  }

  function logout() {
    setUser(null)
    setToken('')
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      initialized,
      isAuthenticated: Boolean(user),
      login,
      signup,
      refreshMe,
      logout,
    }),
    [initialized, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
