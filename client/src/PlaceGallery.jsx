import React, { useEffect, useState } from 'react';
import { CgMenuGridO } from "react-icons/cg";

function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);

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

  if (fullScreenPhoto) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        onClick={() => setFullScreenPhoto(null)}
      >
        <img
          src={`${import.meta.env.VITE_BASE_URL}/uploads/${fullScreenPhoto}`}
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
          <h2 className="text-2xl sm:text-3xl text-black">Photos of {place.title}</h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="flex gap-1 py-2 px-4 rounded-2xl shadow-md shadow-gray-400 bg-red-500 text-white hover:bg-red-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <span className="text-sm sm:text-base">Close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-8 grid gap-4">
          {place?.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index} onClick={() => setFullScreenPhoto(photo)}>
                <img
                  className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                  src={`${import.meta.env.VITE_BASE_URL}/uploads/${photo}`}
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-[2fr_1fr] lg:grid-cols-3 gap-2 rounded-xl overflow-hidden">
        <div className="col-span-1 lg:col-span-2 row-span-2 h-[300px] lg:h-[400px] overflow-hidden">
          {place.photos?.[0] && (
            <div className="w-full h-full">
              <img
                onClick={() => setShowAllPhotos(true)}
                className="w-full h-full object-cover rounded-tl-xl cursor-pointer"
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${place.photos[0]}`}
                alt="Main Image"
              />
            </div>
          )}
        </div>

        {place.photos?.[1] && (
          <div className="h-[150px] lg:h-[200px]">
            <img
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer"
              src={`${import.meta.env.VITE_BASE_URL}/uploads/${place.photos[1]}`}
              alt="Secondary Image 1"
            />
          </div>
        )}
        {place.photos?.[2] && (
          <div className="h-[150px] lg:h-[200px] -mt-2 pt-2">
            <img
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer"
              src={`${import.meta.env.VITE_BASE_URL}/uploads/${place.photos[2]}`}
              alt="Secondary Image 2"
            />
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex gap-1 border-black font-medium items-center text-sm absolute bottom-2 right-2 px-4 py-2 bg-white rounded-xl shadow-sm shadow-gray-500 hover:bg-slate-50 transition-all"
      >
        <CgMenuGridO className="size-4" />
        <span className="hidden sm:block">Show all photos</span>
      </button>
    </div>
  );
}

export default PlaceGallery;
