import axios from '#/api/axios';
import { Container, ServiceUnavailable } from '#/components/Common';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Popconfirm, Skeleton, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const loadingList = [...Array(6).keys()];

const fetchUserBookings = () => axios.get('booking/user');
const cancelBooking = (courtId) => axios.delete(`booking/${courtId}`);

function isPreviousBooking(date, startTime) {
  const currentTime = dayjs();
  return (
    currentTime.isAfter(dayjs(date), 'day') ||
    (currentTime.isSame(dayjs(date), 'day') && currentTime.hour() >= startTime.split(':')[0])
  );
}

export default function Bookings() {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentBookingId, setCurrentBookingId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery(['bookings'], fetchUserBookings);
  const { mutate, isLoading: cancelBookingLoading } = useMutation(cancelBooking, {
    onSuccess: () => {
      messageApi.success('Booking canceled');
      refetch();
    }
  });

  const handleConfirm = (id) => {
    setCurrentBookingId(id);
    mutate(id);
  };

  if (isError)
    return (
      <Container>
        <ServiceUnavailable />
      </Container>
    );

  return (
    <>
      {contextHolder}
      <Container>
        <h1 className='mb-5 text-3xl font-bold text-sky-700 underline'>Your Bookings</h1>
        <div className='grid grid-cols-2 gap-4 '>
          {isLoading
            ? loadingList.map((value) => (
                <div key={value} className='flex gap-x-4'>
                  <Skeleton.Image active className='!aspect-video !h-auto !w-[341px] !rounded-xl' />
                  <Skeleton active />
                </div>
              ))
            : data?.map(({ court, date, startTime, endTime, id, status }) => {
                const { name, imageUrl } = court;
                const formatDate = dayjs(date).format('DD MMM, YYYY');
                return (
                  <div key={id} className='flex gap-x-4'>
                    <img
                      src={imageUrl}
                      alt={name}
                      className='aspect-video max-h-48 rounded-xl object-cover'
                    />
                    <div className='flex flex-col items-start justify-between gap-y-4 pb-2'>
                      <div>
                        <h2 className='mb-3 text-2xl font-semibold text-sky-700'>{name}</h2>
                        <p className='font-medium italic text-slate-600'>
                          on <span className='not-italic text-slate-800'> {formatDate}</span>
                        </p>
                        <p className='mb-3 font-medium italic text-slate-600'>
                          From:{' '}
                          <span className='not-italic text-slate-800'>
                            {startTime?.slice(0, -3)}
                          </span>{' '}
                          To:{' '}
                          <span className='not-italic text-slate-800'>{endTime?.slice(0, -3)}</span>
                        </p>
                        {status === 'successful' ? (
                          <Tag icon={<CheckCircleOutlined />} color='success'>
                            successful
                          </Tag>
                        ) : (
                          <Tag icon={<CloseCircleOutlined />} color='error'>
                            Canceled
                          </Tag>
                        )}
                      </div>
                      {status === 'successful' && (
                        <Popconfirm
                          title='This is a destructive action'
                          description='Are you sure you want to continue?'
                          onConfirm={() => handleConfirm(id)}
                          okText='Yes'
                          cancelText='No'
                          icon={<CloseCircleOutlined style={{ color: 'red' }} />}
                        >
                          <Button
                            danger
                            loading={cancelBookingLoading && id === currentBookingId}
                            disabled={isPreviousBooking(date, startTime)}
                          >
                            Cancel Booking
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      </Container>
    </>
  );
}
