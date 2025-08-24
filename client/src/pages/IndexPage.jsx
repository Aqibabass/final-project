import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-2xl aspect-square mb-2">
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v12H4z" />
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
      </div>
    </div>
  );
}

function ErrorDisplay({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load places</h3>
      <p className="text-gray-600 mb-4">There was an error loading the listings. Please try again.</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/places`);
      setPlaces(response.data);
      setFilteredPlaces(response.data);
    } catch (error) {
      console.error('Error fetching places:', error);
      setError(error.message || 'Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSearch = (query) => {
    const filtered = places.filter(place => {
      const title = place?.title || '';
      const address = place?.address || '';
      return title.toLowerCase().includes(query.toLowerCase()) ||
             address.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredPlaces(filtered);
  };

  return (
    <div>
      <Header places={places} setFilteredPlaces={setFilteredPlaces} handleSearch={handleSearch} />
      <h2 className='font-bold md:text-3xl md:px-2 px-1 py-2 text-2xl mt-6'>
        Find Your Perfect Stay
      </h2>

      <div className="mt-6 mb-8 grid px-1 md:px-2 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          // Show skeleton cards while loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : error ? (
          // Show error state
          <div className="col-span-full">
            <ErrorDisplay onRetry={fetchPlaces} />
          </div>
        ) : filteredPlaces.length > 0 ? (
          // Show actual places
          filteredPlaces.map(place => (
            <Link 
              to={'/place/' + place._id} 
              key={place._id}
              className="transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="bg-gray-500 mb-2 rounded-2xl overflow-hidden">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={place.photos[0]}
                    alt={place.title}
                    loading="lazy"
                  />
                )}
              </div>
              <h2 className="font-medium lg:text-lg md:text-lg text-base mt-2 ">{place.address}</h2>
              <h3 className="mt-1 font-medium md:text-sm text-xs text-gray-500 truncate">{place.title}</h3>
              <div className="mt-1 font-semibold lg:text-lg md:text-base text-sm">
                ₹{place.price} per night
              </div>
            </Link>
          ))
        ) : (
          // Show empty state
          <div className="col-span-full text-center py-8">
            <p className="text-xl font-bold text-gray-900 mb-2">No places found</p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default IndexPage;
