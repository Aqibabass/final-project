import AddressLink from '@/AddressLink';
import BookingDates from '@/BookingDates';
import PlaceGallery from '@/PlaceGallery';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TiArrowBackOutline, TiCancel } from "react-icons/ti";
import { FaRegTrashAlt } from 'react-icons/fa';

function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get('${import.meta.env.VITE_BASE_URL}/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  const cancelBooking = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/bookings/${id}`);
      navigate('/account/bookings');
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const handleBackButtonClick = () => {
    navigate('/account/bookings');
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className=' mt-8 mb-8'>
      <h1 className='text-3xl sm:text-2xl'>{booking.place.title}</h1>
      <AddressLink className='text-sm sm:text-base'>
        {booking.place.address}
      </AddressLink>
      <div className='bg-gray-200 p-6 my-6 rounded-2xl flex flex-col sm:flex-row items-center sm:justify-between'>
        <div className='mb-4 sm:mb-0'>
          <h2 className='text-2xl sm:text-xl mb-4'>Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>

        <div className='flex flex-col sm:flex-row sm:justify-center gap-5 px-4 items-center text-black rounded-2xl'>
          <div className='text-center sm:text-left'>
            Total price
            <div className='text-2xl font-semibold'>₹{booking.price}</div>
          </div>
        </div>

        <div className='flex gap-3 mt-4 sm:mt-0'>
          <button
            onClick={cancelBooking}
            className="text-red-500 justify-around bg-transparent hover:text-red-800"
          >
            <FaRegTrashAlt className='size-7' />
          </button>

          <button
            onClick={handleBackButtonClick}
            className="justify-around bg-transparent hover:text-primary"
          >
            <TiArrowBackOutline className='size-7' />
          </button>
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>

  );
}

export default BookingPage;
