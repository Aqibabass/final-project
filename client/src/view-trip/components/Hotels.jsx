import React from 'react';

import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-xl mt-12 mb-2'>Hotel Recommendation </h2>
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 '>
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem
            key={hotel.id || index} // Assuming `hotel.id` is unique
            hotel={hotel}
          />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
