import { Typography, Button, Card } from 'antd';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center' }} role='alert'>
      <Card style={{ boxShadow: '0px 5px 10px 1px rgba(0, 0, 0, 0.2)' }}>
        <Title level={3}>Something went wrong:</Title>
        <Paragraph code type='danger'>
          {error.message}
        </Paragraph>
        <Button type='primary' onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </Card>
    </div>
  );
}

Fallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
};

export default Fallback;
