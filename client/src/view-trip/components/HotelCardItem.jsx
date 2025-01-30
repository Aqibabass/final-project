import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    await GetPlaceDetails(data).then((resp) => {
      if (resp.data.places[0]?.photos[9]?.name) {
        const photoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[9].name);
        setPhotoUrl(photoUrl);
      }
    });
  };

  return (
    <Link
  to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotelName + ', ' + hotel?.hotelAddress)}`}
  className="text-black"
>
  <div className="border rounded-lg p-2 hover:scale-105 transition-transform cursor-pointer mt-3 w-full sm:w-auto flex flex-col h-full">
    <img 
      src={photoUrl || '/placeholder.jpg'} 
      className="rounded-xl h-[180px] w-full object-cover" 
      alt={hotel?.hotelName || 'Hotel'} 
    />
    <div className="my-3 flex flex-col gap-2 flex-grow">
      <h2 className="font-medium">{hotel?.hotelName}</h2>
      <h2 className="font-medium text-xs text-gray-500">📍 {hotel?.hotelAddress}</h2>
      <h2 className="text-sm">💰 {hotel?.price}</h2>
      <h2 className="text-sm">⭐ {hotel?.rating} stars</h2>
    </div>
  </div>
</Link>
  );
}

export default HotelCardItem;

