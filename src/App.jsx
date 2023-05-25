import { lazy } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AppLayout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Fallback from './components/Fallback';

import 'antd/dist/reset.css';
import './App.css';
import Home from './pages/Home';
import { useAuth } from './context/AuthProvider';
import AdminLayout from './pages/Admin';

const Login = lazy(() => import('#/pages/Login'));
const Register = lazy(() => import('#/pages/Register'));
const Browse = lazy(() => import('#/pages/Browse'));
const CourtDetails = lazy(() => import('#/pages/CourtDetails'));
const Bookings = lazy(() => import('#/pages/Bookings'));

function App() {
  const navigate = useNavigate();
  const { auth, isLoading } = useAuth();
  const { accessToken, role } = auth;
  const isLoggedIn = Boolean(accessToken);

  if (isLoading) return null;

  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => navigate('/')}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='browse'>
            <Route
              index
              element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<Browse />} />}
            />
            <Route
              path=':courtId'
              element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<CourtDetails />} />}
            />
          </Route>
          <Route
            path='bookings'
            element={<ProtectedRoute isAuthenticated={isLoggedIn} element={<Bookings />} />}
          />
        </Route>

        <Route
          path='/admin'
          element={
            <ProtectedRoute
              isAuthenticated={isLoggedIn}
              isAuthorized={role === 'admin'}
              element={<AdminLayout />}
            />
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
