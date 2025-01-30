import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { IoIosSend } from "react-icons/io";

const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userSelection?.location?.label
        };
        const result = await GetPlaceDetails(data).then(resp => {
            console.log(resp.data.places[0].photos[9].name);
            const photoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[9].name);
            setPhotoUrl(photoUrl);
        });
    };

    const handleButtonClick = () => {
        const location = trip?.userSelection?.location?.label;
        if (location) {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
            window.open(googleMapsUrl, '_blank');
        } else {
            console.log('Location not available');
        }
    };

    return (
        <div>
            <img src={photoUrl || '/placeholder.jpg'} className="h-[340px] w-full object-cover rounded-xl" alt="placeholder" />
            <div className="flex justify-between items-center">
                <div className="my-5 flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{trip?.userSelection?.location?.label}</h2>
                    <div className="flex flex-wrap gap-3">
                        <h2 className="p-2 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">
                            📅 {trip.userSelection?.noOfDays} Day
                        </h2>
                        <h2 className="p-2 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">
                            💰 {trip.userSelection?.budget} Budget
                        </h2>
                        <h2 className="p-2 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">
                            🧳 No. of Travellers: {trip.userSelection?.traveller}
                        </h2>
                    </div>
                </div>
                <Button className="mt-10 p-3 flex flex-col gap-2" onClick={handleButtonClick}>
                    <IoIosSend />
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
