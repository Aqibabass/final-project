import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlacePhoto();
    }, [place]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: place.placeName
        };
        const result = await GetPlaceDetails(data).then((resp) => {
            const photoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[9].name);
            setPhotoUrl(photoUrl);
        });
    };

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
                    <h2 className="font-bold sm:text-lg text-base">{place.placeName}</h2> {/* Adjusted for smaller text on mobile */}
                    <p className="sm:text-sm text-xs text-gray-400">{place.placeDetails}</p> {/* Smaller text on mobile */}
                    <p className="sm:text-sm text-xs text-green-500">💵 {place.ticketPricing}</p> {/* Smaller text on mobile */}
                    <p className="sm:text-sm text-xs text-gray-500">🕒 {place.timeTravel}</p> {/* Smaller text on mobile */}
                </div>
            </div>
        </Link>
    );
}

export default PlaceCardItem;
