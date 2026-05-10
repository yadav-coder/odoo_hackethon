import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard.jsx'
import CreateTrip from '../pages/CreateTrip/CreateTrip.jsx'
import Itinerary from '../pages/Itinerary/Itinerary.jsx'
import UserTrips from '../pages/UserTrips/UserTrips.jsx'
import PreviousTrips from '../pages/PreviousTrips/PreviousTrips.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import { UserTripsProvider } from '../context/UserTripsContext.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/previous-trips" element={<PreviousTrips />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/itinerary/:tripId" element={<Itinerary />} />
      <Route
        path="/user-trips"
        element={
          <UserTripsProvider>
            <UserTrips />
          </UserTripsProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
