import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="gradient-bg auth-container">
      <div className="auth-card">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
