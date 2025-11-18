import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
