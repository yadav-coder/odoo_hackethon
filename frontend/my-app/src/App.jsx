import { useState } from 'react'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'

export default function App() {
  const [mode, setMode] = useState('login')

  if (mode === 'register') {
    return <Register onSwitch={() => setMode('login')} />
  }

  return <Login onSwitch={() => setMode('register')} />
}
