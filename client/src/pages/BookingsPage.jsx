import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AccountNav from '@/AccountNav';
import BookingDates from '@/BookingDates';
import PlaceImg from '@/PlaceImg';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('${import.meta.env.VITE_BASE_URL}/bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
      await axios.delete(`/bookings/${id}`);
    } catch (error) {
      setBookings(prevBookings => [...prevBookings, { _id: id }]);
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="items-center text-xl font-bold mb-4">No bookings available</div>
          
        ) : (
          bookings.map(booking => (
            <Link
              key={booking._id}
              to={`/account/bookings/${booking._id}`}
              className="flex flex-col sm:flex-row gap-4 bg-gray-100 p-4 rounded-2xl mb-4"
            >
              <div className="flex aspect-video sm:w-60 bg-gray-300 grow-0 shrink-0 overflow-hidden rounded-xl">
                <PlaceImg className="w-full h-full aspect-video object-cover" place={booking.place} />
              </div>

              <div className="grow sm:ml-4 px-1">
                <h2 className="text-xl font-semibold">{booking.place.title}</h2>
                <BookingDates booking={booking} className="text-sm mt-2 text-gray-600 mb-2" />

                <div className="mt-2 flex gap-1 items-center">
                  <span className="text-lg font-semibold">
                    Total price: ₹{booking.price}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    cancelBooking(booking._id);
                  }}
                  className="mt-2 text-sm sm:text-base px-3 py-2 rounded-xl text-white hover:bg-red-600 transition-all bg-red-500"
                >
                  Cancel Booking
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
