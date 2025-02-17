import AccountNav from '@/AccountNav';
import PlaceImg from '@/PlaceImg';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('/user-places');
        setPlaces(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching places:', error);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Handle the delete action
  const handleDelete = async (placeId, e) => {
    e.stopPropagation(); // Prevents the Link from triggering when clicking delete button
    e.preventDefault();  // Prevents the default behavior of the link
    
    try {
      await axios.delete(`/places/${placeId}`); // DELETE request to your API
      setPlaces(places.filter((place) => place._id !== placeId)); // Remove place from state
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/places/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : places.length > 0 ? (
          places.map((place) => (
            <Link
              key={place._id}
              to={`/account/places/${place._id}`} // Change to direct to the place page in account
              className="flex flex-col sm:flex-row gap-4 bg-gray-100 p-4 rounded-2xl mb-4 hover:bg-gray-200 transition-all"
            >
              <div className="flex aspect-video sm:w-60 bg-gray-300 grow-0 shrink-0 overflow-hidden rounded-xl">
                <PlaceImg place={place} />
              </div>
              <div className="grow sm:ml-4 px-1">
                <h2 className="text-xl font-semibold">{place.title}</h2>
                <p className="text-sm text-justify mr-4 mt-2 text-gray-600 line-clamp-3">{place.description}</p>
                <div className="mt-4">
                  <button
                    onClick={(e) => handleDelete(place._id, e)} // Pass event to handleDelete
                    className="mt-2 text-sm sm:text-base px-3 py-2 rounded-xl text-white hover:bg-red-600 transition-all bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="items-center text-xl font-bold mb-4">No places found.</p>
        )}
      </div>
    </div>
  );
}

export default PlacesPage;
