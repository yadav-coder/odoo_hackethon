import AppRoutes from './routes/AppRoutes.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </AuthProvider>
  )
}
