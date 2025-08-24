import { UserContext } from '@/UserContext';
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AccountNav from '@/AccountNav';
import ProfileCard from '@/components/ProfileCard';

function SkeletonLoader() {
  return (
    <div className="text-center max-w-lg mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
      <div className="text-left">
        <div className="border p-4 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-5 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load profile</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { ready, user, setUser } = useContext(UserContext);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    try {
      await axios.post('/logout');
      setUser(null);
      setRedirect('/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Could add a toast notification here
    }
  }

  async function handleUpdateProfile(updatedDetails) {
    setIsUpdating(true);
    setUpdateError(null);
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
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  }

  if (!ready) {
    return <SkeletonLoader />;
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
          {updateError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {updateError}
              <button 
                onClick={() => setUpdateError(null)} 
                className="ml-2 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          )}
          {!isEditing ? (
            <div className="text-left text-gray-600">
              <div className="border p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <p className="mb-2">
                  <strong className="text-gray-700">Username:</strong>{' '}
                  <span className="ml-2">{user?.name}</span>
                </p>
                <p>
                  <strong className="text-gray-700">Email:</strong>{' '}
                  <span className="ml-2">{user?.email}</span>
                </p>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="primary hover:bg-cyan-400 mt-4 w-full transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="relative">
              {isUpdating && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg z-10">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <ProfileCard
                user={user}
                onSave={handleUpdateProfile}
                onCancel={() => {
                  setIsEditing(false);
                  setUpdateError(null);
                }}
              />
            </div>
          )}
          <button 
            onClick={logout} 
            className="primary hover:bg-red-400 mt-4 mb-8 w-full transition-colors"
          >
            Logout
          </button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  );
}

export default ProfilePage;
