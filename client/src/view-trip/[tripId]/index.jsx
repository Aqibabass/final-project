import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../../components/ui/custom/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip,setTrip] =useState([]) ;

  const GetTripData = async () => {
    const docRef = doc(db, 'AITrips', tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document:', docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log('No Such Document');
      toast('No trip Found!');
    }
  };

  useEffect(() => {
    
    tripId && GetTripData();
    
  }, [tripId]);

  return (
    <>
   
    <div className='mb-8 px-1 md:px-2 mt-8'>
  
  <InfoSection trip={trip} />
  
  
  <Hotels trip={trip}/>
  
  

    <PlacesToVisit trip={trip}/>
 
  
  
  
  
</div>

<Footer trip={trip}/>
</>
  );
}

export default Viewtrip;
