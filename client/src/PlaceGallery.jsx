import React, { useState } from 'react';
import { CgMenuGridO } from "react-icons/cg";
function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);


  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-white  min-h-screen">
        <div className="bg-white p-4 sm:p-8 grid gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl text-black mr-0 sm:mr-48">Photos of {place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-4 sm:right-12 top-4 sm:top-7 flex gap-1 py-2 px-4 
              rounded-2xl shadow-md shadow-gray-400
               bg-red-500 text-white hover:bg-red-700 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              <span className="text-sm sm:text-base">Close photos</span>
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index}>
                <img
                  className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg"
                  src={'http://localhost:4000/uploads/' + photo}
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
                src={'http://localhost:4000/uploads/' + place.photos[0]}
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
              src={'http://localhost:4000/uploads/' + place.photos[1]}
              alt="Secondary Image 1"
            />
          </div>
        )}
        {place.photos?.[2] && (
          <div className="h-[150px] lg:h-[200px] -mt-2 pt-2">
            <img
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer"
              src={'http://localhost:4000/uploads/' + place.photos[2]}
              alt="Secondary Image 2"
            />
          </div>
        )}
      </div>

      
      <button
  onClick={() => setShowAllPhotos(true)}
  className="flex gap-1 border-black  font-medium 
  items-center text-sm absolute bottom-2 right-2 px-4 py-2
   bg-white rounded-xl shadow-sm shadow-gray-500 hover:bg-slate-50 transition-all"
>
<CgMenuGridO className='size-4' />
  <span className="hidden sm:block">Show all photos</span>
</button>

    </div>
  );
}

export default PlaceGallery;
