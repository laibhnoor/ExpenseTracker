import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'expense-tracker-auth'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!savedAuth) {
      return
    }

    try {
      setUser(JSON.parse(savedAuth))
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  function persistAuth(nextUser) {
    setUser(nextUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
  }

  function login(payload) {
    persistAuth({
      id: Date.now(),
      name: payload.name ?? 'User',
      email: payload.email,
    })
  }

  function signup(payload) {
    persistAuth({
      id: Date.now(),
      name: payload.name,
      email: payload.email,
    })
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
    }),
    [user],
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
