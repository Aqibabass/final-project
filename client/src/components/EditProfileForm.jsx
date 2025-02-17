import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfileForm({ user, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
    }
  }, [user]);

  async function updateProfile(e) {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put('/update-profile', { username, password });
      setUser((prev) => ({ ...prev, name: username }));
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    }
  }

  return (
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label className="block text-left mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="cursor-not-allowed w-full border p-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-left mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-left mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        {message && (
          <p
            className={`text-sm ${
              message.includes('success') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <button type="submit" className="primary max-w-sm mt-2">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfileForm;
