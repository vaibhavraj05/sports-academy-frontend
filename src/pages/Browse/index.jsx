import axios from '#/api/axios';
import { Container, ServiceUnavailable } from '#/components/Common';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function getAllCourts() {
  return axios.get('court');
}

export default function Browse() {
  const {
    data: courtData,
    isLoading,
    isError
  } = useQuery({ queryKey: ['courts'], queryFn: getAllCourts });
  const navigate = useNavigate();

  const courtList = courtData || [...Array(8).keys()];

  if (isError) return <ServiceUnavailable />;

  return (
    <Container>
      <Title>Courts</Title>

      <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {courtList?.map(({ id, name, image_url: imageUrl, description }, index) => {
          const { length, width } = description || {};
          return (
            <Card
              hoverable
              cover={
                <img
                  alt='court'
                  className='aspect-video cursor-default object-cover'
                  src={imageUrl}
                />
              }
              bodyStyle={{ padding: 15, cursor: 'default' }}
              key={id || index}
              loading={isLoading}
            >
              <Title level={4}>{name}</Title>
              <div className='mb-5 flex gap-x-5'>
                <div>
                  <Text strong>Length: </Text> <Text>{length}</Text>
                </div>
                <div>
                  <Text strong>Width: </Text> <Text>{width}</Text>
                </div>
              </div>
              <Button type='primary' onClick={() => navigate(id)}>
                Book Now
              </Button>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
