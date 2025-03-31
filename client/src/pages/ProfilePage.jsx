import { UserContext } from '@/UserContext';
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AccountNav from '@/AccountNav';
import ProfileCard from '@/components/ProfileCard';
import { RiLoader4Line } from 'react-icons/ri';


function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false); 

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  async function handleUpdateProfile(updatedDetails) {
    try {
      const response = await axios.put('/update-profile', updatedDetails);
      setUser((prev) => ({
        ...prev,
        name: updatedDetails.username,
        email: updatedDetails.email,
      }));
      setIsEditing(false); 
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  if (!ready) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-10"><RiLoader4Line className="animate-spin text-6xl text-primary" /></div>;
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          {!isEditing ? (
            <div className='text-left text-gray-600'>
             <div className='items-center border p-4 rounded-2xl'>

               <p>
                <strong>Username:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
             </div>
             
              <button
                onClick={() => setIsEditing(true)}
                className="primary hover:bg-cyan-400 mt-4"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <ProfileCard
              user={user}
              onSave={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
          <button onClick={logout} className="primary hover:bg-red-400 mt-4 mb-8">
  Logout
</button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  );
}

export default ProfilePage;
