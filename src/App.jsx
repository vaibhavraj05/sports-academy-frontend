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

const Login = lazy(() => import('#/components/Login'));
const Register = lazy(() => import('#/components/Register'));
const Browse = lazy(() => import('#/pages/Browse'));

function App() {
  const navigate = useNavigate();
  const {
    auth: { accessToken }
  } = useAuth();
  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => navigate('/')}>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route
            path='browse'
            element={<ProtectedRoute isLoggedIn={Boolean(accessToken)} element={<Browse />} />}
          />
          <Route path='about' element={<h1>This is About Page</h1>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
