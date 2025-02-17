import AddressLink from '@/AddressLink';
import BookingWidget from '@/BookingWidget';
import PlaceGallery from '@/PlaceGallery';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FaWifi, FaParking, FaTv, FaPaw } from 'react-icons/fa';
import { HiOutlineRadio } from "react-icons/hi2";
import { MdAcUnit, MdLock } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';

function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/places/' + id).then((response) => {
      setPlace(response.data);
    }).catch((error) => {
      console.error('Error fetching place:', error);
    });
  }, [id]);

  if (!place) return <div>Loading...</div>;

  const toggleDescription = () => setIsExpanded(prev => !prev);

  const descriptionText = place.description;
  const shortenedDescription = descriptionText.length > 630 ? descriptionText.slice(0, 630) + '...' : descriptionText;

  return (
    <div className='mt-2 -mx-8 px-8 pt-4'>
      <h1 className='text-3xl'>{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />

      <div className="text-xl mt-8 font-semibold bg-white -mx-8 px-8 py-8 border-b border-t">
        Hosted By: {place.owner ? place.owner.name.charAt(0).toUpperCase() + place.owner.name.slice(1) : 'Loading...'}
      </div>

      <div className='mt-4 mb-4 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]'>
        <div>
          <div className="mb-6">
            <h2 className="mb-2 font-semibold text-2xl">Description</h2>
            <p className="text-justify text-gray-700">
              {isExpanded ? descriptionText : shortenedDescription}
            </p>
            {descriptionText.length > 630 && (
              <button onClick={toggleDescription} className="text-black bg-white underline mt-2">
                {isExpanded ? 'Show Less' : 'Show More '}
              </button>
            )}
          </div>

          <div className="mt-9">
            <h2 className="font-semibold text-2xl">What this place offers</h2>
            <ul className="list-none py-6">
              {place.perks.map((perk, index) => (
                <li key={index} className="flex text-gray-600 text-xl items-center gap-3">
                  {perk === 'wifi' && <FaWifi className="w-5 h-5" />}
                  {perk === 'parking' && <FaParking className="w-5 h-5" />}
                  {perk === 'tv' && <FaTv className="w-5 h-5" />}
                  {perk === 'pets' && <FaPaw className="w-5 h-5" />}
                  {perk === 'ac' && <MdAcUnit className="w-5 h-5" />}
                  {perk === 'home' && <AiOutlineHome className="w-5 h-5" />}
                  {perk === 'radio' && <HiOutlineRadio className="w-5 h-5" />}
                  {perk === 'entrance' && <MdLock className="w-5 h-5" />}
                  {perk.charAt(0).toUpperCase() + perk.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mt-4'>
          <BookingWidget place={place} />
        </div>
      </div>

      <div className="text-xl font-semibold bg-white -mx-8 px-8 py-8 border-t">
        Check-in: {place.checkIn} <br />
        Check-out: {place.checkOut} <br />
        Max number of guests: {place.maxGuests}
      </div>

      <div className=" -mx-8 px-8 py-8 border-t">
        <div className='mt-4'>
          <h2 className='font-semibold text-2xl'>Extra info</h2>
        </div>
        <div className='mb-4 mt-2 text-sm text-gray-700 leading-5'>
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}

export default PlacePage;
