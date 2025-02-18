import { Button } from '@/components/ui/button';
import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { CgMenuGridO } from "react-icons/cg";

const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1200&maxWidthPx=1200&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

function InfoSection({ trip }) {
    const [photoUrls, setPhotoUrls] = useState([]);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [fullScreenPhoto, setFullScreenPhoto] = useState(null);

    useEffect(() => {
        if (trip) {
            GetPlacePhotos();
        }
    }, [trip]);

    useEffect(() => {
        if (showAllPhotos || fullScreenPhoto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showAllPhotos, fullScreenPhoto]);

    const GetPlacePhotos = async () => {
        const data = { textQuery: trip?.userSelection?.location?.label };
        try {
            const result = await GetPlaceDetails(data);
            const photos = result.data.places[0].photos.slice(0, 9);
            const urls = photos.map(photo => PHOTO_REF_URL.replace('{NAME}', photo.name));
            setPhotoUrls(urls);
        } catch (error) {
            console.error('Error fetching place photos:', error);
        }
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

    if (fullScreenPhoto) {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={() => setFullScreenPhoto(null)}
            >
                <img
                    src={fullScreenPhoto}
                    alt="Full Screen"
                    className="max-w-full max-h-full rounded-lg"
                />
            </div>
        );
    }

    if (showAllPhotos) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                    <h2 className="text-2xl sm:text-3xl text-black">{trip?.userSelection?.location?.label} Photos</h2>
                    <button
                        onClick={() => setShowAllPhotos(false)}
                        className="flex gap-1 py-2 px-4 rounded-2xl items-center shadow-md shadow-gray-400 bg-red-500 text-white hover:bg-red-700 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm sm:text-base">Close</span>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 sm:p-8 grid gap-4">
                    {photoUrls.map((url, index) => (
                        <div key={index} onClick={() => setFullScreenPhoto(url)}>
                            <img
                                className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                                src={url}
                                alt={`Photo ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="relative">
                <div className="grid grid-cols-[2fr_1fr] lg:grid-cols-3 gap-2 rounded-xl overflow-hidden">
                    <div className="col-span-1 lg:col-span-2 row-span-2 h-[300px] lg:h-[400px] overflow-hidden">
                        {photoUrls.length > 0 && (
                            <div className="w-full h-full">
                                <img
                                    onClick={() => setShowAllPhotos(true)}
                                    className="w-full h-full object-cover rounded-tl-xl cursor-pointer"
                                    src={photoUrls[5]}
                                    alt="Main Image"
                                />
                            </div>
                        )}
                    </div>

                    {photoUrls[1] && (
                        <div className="h-[150px] lg:h-[200px]">
                            <img
                                onClick={() => setShowAllPhotos(true)}
                                className="w-full h-full object-cover cursor-pointer"
                                src={photoUrls[1]}
                                alt="Secondary Image 1"
                            />
                        </div>
                    )}

                    {photoUrls[2] && (
                        <div className="h-[150px] lg:h-[200px] -mt-2 pt-2">
                            <img
                                onClick={() => setShowAllPhotos(true)}
                                className="w-full h-full object-cover cursor-pointer"
                                src={photoUrls[2]}
                                alt="Secondary Image 2"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex gap-1 border-black font-medium items-center text-sm absolute bottom-2 right-2 px-4 py-2 bg-white rounded-xl shadow-sm shadow-gray-500 hover:bg-slate-50 transition-all"
                >
                    <CgMenuGridO className="w-5 h-5" />
                    <span className="hidden sm:block">Show all photos</span>
                </button>
            </div>

            <div className="flex justify-between items-center mt-5">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{trip?.userSelection?.location?.label}</h2>
                    <div className=" mt-4 flex flex-wrap gap-3">
                        <h2 className="p-2 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">📅 {trip?.userSelection?.noOfDays} Day </h2>
                        <h2 className="p-2 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">💰 {trip?.userSelection?.budget} Budget </h2>
                        <h2 className="p-2 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-base">🧳 No. of Travellers: {trip?.userSelection?.traveller}</h2>
                    </div>
                </div>
                <Button className="mt-12 p-3 border rounded-btn text-white bg-white hover:bg-gray-200 flex flex-col gap-2" onClick={handleButtonClick}>
                    <IoLocationSharp className="text-red-500" />
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
