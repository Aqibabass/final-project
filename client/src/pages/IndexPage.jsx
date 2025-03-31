import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RiLoader4Line } from 'react-icons/ri';

function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/places`);
        setPlaces(response.data);
        setFilteredPlaces(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching places:', error);
        setLoading(false);
      }
    };

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
      <h2 className='font-bold md:text-3xl md:px-2 px-1 py-2 text-2xl  mt-6'>Find Your Perfect Stay</h2>
      <div className="mt-6 mb-8 grid px-1 md:px-2 gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-10"><RiLoader4Line className="animate-spin text-6xl text-primary" /></div>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <Link to={'/place/' + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl overflow-hidden">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square transition-transform
                     duration-300 ease-in-out transform hover:scale-110"
                    src={place.photos[0]} // Use Cloudinary URL directly
                    alt={place.title}
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
          <p className="items-center text-xl font-bold mb-4">No places found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default IndexPage;
