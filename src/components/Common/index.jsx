import PropTypes from 'prop-types';

function Container({ className = '', children }) {
  return <div className={`flex-1 bg-white p-5 ${className}`}>{children}</div>;
}

function ServiceUnavailable() {
  return <h1 className=' text-3xl font-bold'>Service Unavailable. Please try again later</h1>;
}

Container.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  className: PropTypes.string
};

export { Container, ServiceUnavailable };
