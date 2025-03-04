import { FaRegTrashAlt } from 'react-icons/fa';
import { doc, deleteDoc } from 'firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { UserContext } from '@/UserContext';
import { SkeletonCard } from '@/components/ui/skeleton';
import UserTripCardItem from './components/UserTripCardItem';
import Footer from '@/components/Footer';

function MyTrips() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      if (!user) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser)); 
        } else {
          navigate('/login'); 
        }
      } else {
        GetUserTrips();
      }
    };
    checkUserSession();
  }, [user]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      const tripDocRef = doc(db, 'AITrips', tripId);
      await deleteDoc(tripDocRef);
      setUserTrips(userTrips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <>
      <div className='mb-8 px-1 mt-8 min-h-screen'>
        <h2 className='font-bold text-3xl mb-8'>My Trips</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <SkeletonCard 
                key={index} 
                imageClassName="h-[220px]" 
              />
            ))
          ) : userTrips.length > 0 ? (
            userTrips.map((trip) => (
              <div key={trip.id} className="relative">
                <UserTripCardItem trip={trip} />
                <FaRegTrashAlt 
                  className="cursor-pointer absolute top-2 right-2 text-red-500 size-7 hover:text-red-800"
                  onClick={() => handleDeleteTrip(trip.id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No trips found. Create your first trip!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyTrips;
