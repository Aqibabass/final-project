import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';


import { UserContext } from '@/UserContext';
import { Skeleton } from '@/components/ui/skeleton';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      GetUserTrips();
    } else {
      navigate('/login');
    }
  }, [user]); // Add user to dependency array

  const GetUserTrips = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'AITrips'),
        where('userEmail', '==', user?.email)
      );
      
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      // Consider adding error state here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='sm:px-10 md:px-16 lg:px-24 xl:px-32 px-5 mt-16 min-h-screen'>
      <h2 className='font-bold text-3xl mb-8'>My Trips</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {loading ? (
          // Loading skeleton
          Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-[220px] w-full rounded-xl" />
          ))
        ) : userTrips.length > 0 ? (
          userTrips.map((trip) => (
            <UserTripCardItem trip={trip} key={trip.id} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No trips found. Create your first trip!
          </div>
        )}
      </div>

      <div className="mt-16">
        
      </div>
    </div>
  );
}

export default MyTrips;