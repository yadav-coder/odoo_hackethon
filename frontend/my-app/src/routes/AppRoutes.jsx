import { Navigate, Route, Routes } from 'react-router-dom'
import { UserTripsProvider } from '../context/UserTripsContext.jsx'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx'

import Dashboard from '../pages/Dashboard/Dashboard.jsx'
import CreateTrip from '../pages/CreateTrip/CreateTrip.jsx'
import Itinerary from '../pages/Itinerary/Itinerary.jsx'
import UserTrips from '../pages/UserTrips/UserTrips.jsx'
import PreviousTrips from '../pages/PreviousTrips/PreviousTrips.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import Profile from '../pages/Profile/Profile.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/previous-trips" element={<ProtectedRoute><PreviousTrips /></ProtectedRoute>} />
      <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/itinerary/:tripId" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route
        path="/user-trips"
        element={
          <ProtectedRoute>
            <UserTripsProvider>
              <UserTrips />
            </UserTripsProvider>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
