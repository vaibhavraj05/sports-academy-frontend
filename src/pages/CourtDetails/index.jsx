import axios from '#/api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Button, DatePicker, Skeleton, Spin, message } from 'antd';
import shortid from 'shortid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const dateFormat = 'YYYY-MM-DD';
const padZero = (number) => number.toString().padStart(2, '0');

function fetchCourtDetailsAndBookedSlots({ queryKey }) {
  const [, courtId, date] = queryKey;
  const params = {
    date: date?.format(dateFormat) || null
  };
  return axios.get(`booking/court/${courtId}`, {
    params
  });
}

function bookCourt({ courtId, date, slot }) {
  const [startTime, endTime] = slot;
  return axios.post('booking', {
    courtId,
    date,
    startTime: `${startTime}:00`,
    endTime: `${endTime}:00`
  });
}

const getDisabledDate = (currentDate) =>
  dayjs().format(dateFormat) > currentDate.format(dateFormat);

function getAvailableSlot(bookedSlots, bookingDate) {
  const availableSlots = [];
  let pointer = 0;
  let startingHour = 6;

  if (dayjs()?.format(dateFormat) === bookingDate?.format(dateFormat)) {
    const currentHour = dayjs().hour();

    startingHour = currentHour >= 6 ? currentHour + 1 : 6;
  }

  for (let hour = startingHour; hour <= 22; hour++) {
    if (
      bookedSlots?.length &&
      pointer < bookedSlots.length &&
      bookedSlots[pointer][0] === `${padZero(hour)}:00:00`
    ) {
      pointer++;
    } else {
      availableSlots.push([hour, hour + 1]);
    }
  }
  return availableSlots;
}

let fetchBookedSlot = false;

export default function CourtDetails() {
  const { courtId } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const todayDate = dayjs();
  const [bookingDate, setBookingDate] = useState(todayDate);
  const [slot, setSlot] = useState(null);

  const {
    data: courtDetails,
    isLoading,
    isError
  } = useQuery(['courtId', courtId], fetchCourtDetailsAndBookedSlots);
  const { name, imageUrl, description, count, bookings: todayBookings } = courtDetails || {};

  const { data: bookedSlots, isLoading: isBookSlotLoading } = useQuery(
    ['slot', courtId, bookingDate],
    fetchCourtDetailsAndBookedSlots,
    {
      enabled: fetchBookedSlot,
      onError: () => messageApi.warning('There was an error while fetching the slots')
    }
  );
  const availableSlots = getAvailableSlot(bookedSlots?.bookings || todayBookings, bookingDate);

  const { mutate, isLoading: isBookCourtLoading } = useMutation(bookCourt, {
    onSuccess: () => {
      queryClient.invalidateQueries(['slot']);
      setSlot(null);
      messageApi.success('Court booked successfully');
    },
    onError: (error) => {
      messageApi.error(error?.response?.data?.message);
      setSlot(null);
    }
  });

  const handleSlotClick = (startTime, endTime) => {
    setSlot((prev) => {
      if (prev && prev[0] === startTime && prev[1] === endTime) {
        return null;
      }
      return [startTime, endTime];
    });
  };

  const handleBooking = () => {
    mutate({ courtId, date: bookingDate, slot });
    fetchBookedSlot = true;
  };

  const handleDateChange = (value) => {
    setBookingDate(value);
    fetchBookedSlot = true;
  };

  useEffect(() => {
    setSlot(null);
  }, [bookingDate]);

  if (isLoading) {
    return (
      <>
        <Skeleton active paragraph={{ rows: 0 }} />
        <div className='grid h-[50vh] grid-cols-6 gap-x-5'>
          <Skeleton.Image active rootClassName='col-span-4' className='!h-full !w-full' />
          <Skeleton active paragraph={5} title className='col-span-2' />
        </div>
      </>
    );
  }

  if (isError) {
    return <h1 className=' text-3xl font-bold'>Service Unavailable. Please try again later</h1>;
  }

  return (
    <>
      {contextHolder}
      <div className='grid grid-cols-6 gap-x-5'>
        <img
          src={imageUrl}
          alt={name}
          className='col-span-4 aspect-video w-full rounded-xl object-cover'
        />
        <div className='col-span-2 py-3'>
          <h1 className='text-4xl font-bold text-sky-800'>{name}</h1>
          <div className='mt-6 grid h-fit grid-cols-2 gap-y-3 text-base'>
            {Object.entries(description).map(([key, value]) => (
              <p key={shortid.generate()}>
                <span className='font-semibold capitalize text-slate-900'>{key}: </span>
                <span className='font-medium text-slate-700'>{value}</span>
              </p>
            ))}
            <p className='col-span-2'>
              <span className='font-semibold text-slate-900'>Number of courts: </span>
              <span className='font-medium text-slate-700'>{count}</span>
            </p>
          </div>
          <div className='mt-5'>
            <h2 className='mb-3 text-xl font-bold text-sky-700'>Available Slots</h2>
            <div className='flex justify-between'>
              <DatePicker
                defaultValue={todayDate}
                value={bookingDate}
                showToday
                onChange={handleDateChange}
                disabledDate={getDisabledDate}
                allowClear={false}
              />
              <Button
                type='primary'
                className='!px-5'
                disabled={!slot}
                onClick={handleBooking}
                loading={isBookCourtLoading}
              >
                Book
              </Button>
            </div>
            <Spin spinning={(fetchBookedSlot && isBookSlotLoading) || isBookCourtLoading}>
              <div className='my-5 grid grid-cols-[repeat(auto-fit,minmax(71px,1fr))] gap-3'>
                {!availableSlots.length && (
                  <p className='rounded-lg border-2 border-orange-500 bg-orange-100 py-3 text-center text-base font-medium text-orange-500'>
                    We’re fully booked!
                  </p>
                )}
                {availableSlots?.map(([startTime, endTime]) => (
                  <button
                    type='button'
                    key={shortid.generate()}
                    className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-center hover:border-sky-500 hover:bg-sky-100 ${
                      slot && startTime === slot[0] && endTime === slot[1]
                        ? 'border-sky-500 bg-sky-100'
                        : 'border-slate-800'
                    }`}
                    onClick={() => handleSlotClick(startTime, endTime)}
                  >
                    {startTime} - {endTime}
                  </button>
                ))}
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
}
