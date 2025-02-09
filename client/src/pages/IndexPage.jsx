import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';

function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('/places');
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

      <div className="mt-12 mb-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div>Loading...</div>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <Link to={'/place/' + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl overflow-hidden">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square transition-transform
                     duration-300 ease-in-out transform hover:scale-110"
                    src={`http://localhost:4000/uploads/${place.photos[0]}`}
                    alt={place.title}
                  />
                )}
              </div>
              <h2 className="font-medium text-xl mt-2">{place.address}</h2>
              <h3 className="mt-2 font-medium text-gray-500">{place.title}</h3>
              <div className="mt-2 font-semibold text-lg">
                ₹{place.price} per night
              </div>
            </Link>
          ))
        ) : (
          <p>No places found.</p>
        )}
      </div>
    </div>
  );
}

export default IndexPage;
