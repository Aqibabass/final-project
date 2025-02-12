import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    const GetPlacePhoto = async () => {
      if (!trip?.userSelection?.location?.label) return;

      const data = {
        textQuery: trip.userSelection.location.label,
      };

      try {
        const resp = await GetPlaceDetails(data);
        if (resp.data.places[0]?.photos[9]?.name) {
          const photoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[9].name);
          setPhotoUrl(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching trip photo:", error);
      }
    };

    GetPlacePhoto();
  }, [trip]);

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className='rounded-2xl overflow-hidden'>
        <img
          src={photoUrl || '/placeholder.jpg'}
          className="rounded-2xl object-cover h-[220px] w-full transition-transform
          duration-300 ease-in-out transform hover:scale-110"
          alt={trip?.userSelection?.location?.label || 'Trip Location'}
        />
      </div>
      <div className='p-2'>
        <h2 className='font-bold text-lg'>
          {trip?.userSelection?.location?.label}
        </h2>
        <h2 className='text-sm text-gray-500'>
          {trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
        </h2>
      </div>
    </Link>
  );
}

export default UserTripCardItem;