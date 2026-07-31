import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../features/auth/pages/Login';
import Dashboard from '../features/dashboard/pages/Dashboard';
import Doctors from '../features/doctors/pages/Doctors';
import Patients from '../features/patients/pages/Patients';
import AppointmentBooking from '../features/appointments/pages/AppointmentBooking';
import AppointmentList from '../features/appointments/pages/AppointmentList';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'doctors', element: <Doctors /> },
      { path: 'patients', element: <Patients /> },
      { path: 'appointments/book', element: <AppointmentBooking /> },
      { path: 'appointments', element: <AppointmentList /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);