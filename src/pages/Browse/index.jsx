import axios from '#/api/axios';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Typography } from 'antd';

const { Title, Text } = Typography;

function getAllCourts() {
  return axios.get('admin/courts');
}

export default function Browse() {
  const {
    data: courtData,
    isLoading,
    isError
  } = useQuery({ queryKey: ['courts'], queryFn: getAllCourts });

  const courtList = courtData || [...Array(8).keys()];

  if (isError) return <Title>Service Unavailable</Title>;

  return (
    <div>
      <Title>Courts</Title>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {courtList?.map(({ id, name, image_url: imageUrl, description }, index) => {
          const { length, width } = description || {};
          return (
            <Card
              hoverable
              cover={<img alt='court' className='object-cover aspect-video' src={imageUrl} />}
              bodyStyle={{ padding: 15 }}
              key={id || index}
              loading={isLoading}
            >
              <Title level={4}>{name}</Title>
              <div className='flex gap-x-5 mb-5'>
                <div>
                  <Text strong>Length: </Text> <Text>{length}</Text>
                </div>
                <div>
                  <Text strong>Width: </Text> <Text>{width}</Text>
                </div>
              </div>
              <Button type='primary'>Book Now</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
