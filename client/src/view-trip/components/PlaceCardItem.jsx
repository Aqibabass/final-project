import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    const GetPlacePhoto = async () => {
      if (!place?.placeName) return;

      const data = {
        textQuery: place.placeName,
      };

      try {
        const resp = await GetPlaceDetails(data);
        if (resp.data.places[0]?.photos[9]?.name) {
          const photoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[9].name);
          setPhotoUrl(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching place photo:", error);
      }
    };

    GetPlacePhoto();
  }, [place]);

  return (
    <Link 
      to={`https://www.google.com/maps/search/?api=1&query=${place.placeName},${place.placeAddress}`} 
      className="text-black" 
    >
      <div className="border rounded-xl p-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md w-full h-full cursor-pointer">
        <img
          src={photoUrl || '/placeholder.jpg'}
          className="w-[130px] aspect-square rounded-xl object-cover"
          alt={place.placeName}
        />
        <div className="flex flex-col justify-between">
          <h2 className="font-bold sm:text-lg text-base">{place.placeName}</h2>
          <p className="sm:text-sm text-xs text-gray-400">{place.placeDetails}</p>
          <p className="sm:text-sm text-xs text-green-500">💵 {place.ticketPricing}</p>
          <p className="sm:text-sm text-xs text-gray-500">🕒 {place.timeTravel}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;