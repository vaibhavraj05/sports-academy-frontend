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

const Login = lazy(() => import('#/pages/Login'));
const Register = lazy(() => import('#/pages/Register'));
const Browse = lazy(() => import('#/pages/Browse'));
const CourtDetails = lazy(() => import('#/pages/CourtDetails'));
const Bookings = lazy(() => import('#/pages/Bookings'));

function App() {
  const navigate = useNavigate();
  const {
    auth: { accessToken }
  } = useAuth();
  const isLoggedIn = Boolean(accessToken);

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
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<Browse />} />}
            />
            <Route
              path=':courtId'
              element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<CourtDetails />} />}
            />
          </Route>
          <Route
            path='bookings'
            element={<ProtectedRoute isLoggedIn={isLoggedIn} element={<Bookings />} />}
          />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
