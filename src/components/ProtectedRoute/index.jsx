import { message } from 'antd';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, isAuthorized = true, element }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  if (!isAuthorized) {
    message.warning('Unauthorized access');
    return <Navigate to='/' replace />;
  }
  return element;
}

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool,
  element: PropTypes.element.isRequired
};

export default ProtectedRoute;
