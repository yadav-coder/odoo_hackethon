import AppRoutes from './routes/AppRoutes.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'

export default function App() {
  return (
    <DashboardProvider>
      <AppRoutes />
    </DashboardProvider>
  )
}
