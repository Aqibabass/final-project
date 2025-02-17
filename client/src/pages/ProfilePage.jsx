import { UserContext } from '@/UserContext';
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AccountNav from '@/AccountNav';
import ProfileCard from '@/components/ProfileCard';

function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false); 

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  useEffect(() => {
    if (redirect) {
      return <Navigate to={redirect} />;
    }
  }, [redirect]);

  async function logout() {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/logout`);
      setRedirect('/');  // Redirect to homepage after logout
      setUser(null);      // Reset user context
    } catch (error) {
      console.error('Failed to log out:', error);
      // Optionally handle logout failure (e.g., show a message to the user)
    }
  }

  async function handleUpdateProfile(updatedDetails) {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/update-profile`, updatedDetails);
      setUser((prev) => ({
        ...prev,
        name: updatedDetails.username,
        email: updatedDetails.email,
      }));
      setIsEditing(false); // Exit editing mode after save
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  if (!ready) {
    return 'Loading...';
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
