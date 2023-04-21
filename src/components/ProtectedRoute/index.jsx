import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ isLoggedIn, element }) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return element;
}

ProtectedRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  element: PropTypes.element.isRequired
};

export default ProtectedRoute;
