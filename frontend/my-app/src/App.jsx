<<<<<<< Updated upstream
import { useState } from 'react'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'

export default function App() {
  const [authView, setAuthView] = useState(() => (localStorage.getItem('token') ? 'dashboard' : 'login'))

  if (authView === 'dashboard') {
    return <Dashboard />
  }

  if (authView === 'register') {
    return <Register onSwitch={() => setAuthView('login')} />
  }

  return <Login onSwitch={() => setAuthView('register')} onSuccess={() => setAuthView('dashboard')} />
=======
import AppRoutes from './routes/AppRoutes.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'

export default function App() {
  return (
    <DashboardProvider>
      <AppRoutes />
    </DashboardProvider>
  )
>>>>>>> Stashed changes
}
