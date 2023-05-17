import axios from '#/api/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { DatePicker, Skeleton } from 'antd';
import shortid from 'shortid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const dateFormat = 'YYYY-MM-DD';

function getCourtDetails({ queryKey }) {
  const courtId = queryKey[1];
  return axios.get(`court/${courtId}`);
}

function getBookedSlots({ queryKey }) {
  const [, courtId, date] = queryKey;
  return axios.get(`booking/court/${courtId}`, {
    params: {
      date: date.format(dateFormat)
    }
  });
}

const getDisabledDate = (currentDate) =>
  dayjs().format(dateFormat) > currentDate.format(dateFormat);

function getAvailableSlot(bookedSlots, bookingDate) {
  const availableSlots = [];
  let pointer = 0;
  let startingHour = 6;

  if (dayjs().format(dateFormat) === bookingDate.format(dateFormat)) {
    const currentHour = dayjs().hour() + 1;

    startingHour = currentHour >= 6 ? currentHour + 1 : 6;
  }

  for (let hour = startingHour; hour <= 23; hour++) {
    if (
      bookedSlots?.length &&
      pointer < bookedSlots.length &&
      bookedSlots[pointer][0] === `${hour}:00:00`
    ) {
      pointer++;
    } else {
      availableSlots.push([hour, hour + 1]);
    }
  }
  return availableSlots;
}

export default function CourtDetails() {
  const { courtId } = useParams();

  const todayDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(todayDate);

  const { data: courtDetails, isLoading } = useQuery(['courtId', courtId], getCourtDetails);
  const { name, imageUrl, description, count, bookings: todayBookings } = courtDetails || {};

  const { data: bookedSlots, refetch: refetchSlotDetails } = useQuery(
    ['slot', courtId, selectedDate],
    getBookedSlots,
    {
      enabled: false
    }
  );

  const availableSlots = getAvailableSlot(bookedSlots || todayBookings, selectedDate);

  useEffect(() => {
    refetchSlotDetails();
  }, [selectedDate]);

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

  return (
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
          <DatePicker
            defaultValue={todayDate}
            value={selectedDate}
            showToday
            onChange={setSelectedDate}
            disabledDate={getDisabledDate}
          />
          <div className='mt-5 grid grid-cols-[repeat(auto-fit,minmax(65px,1fr))] gap-3'>
            {availableSlots?.map(([startTime, endTime]) => (
              <span
                key={shortid.generate()}
                className='cursor-pointer rounded-lg border-2 border-slate-800 px-3 py-2 text-center hover:border-sky-500 hover:bg-sky-100'
              >
                {startTime} - {endTime}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
