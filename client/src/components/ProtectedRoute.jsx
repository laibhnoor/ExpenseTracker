import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { isAuthenticated, initialized } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-600">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
