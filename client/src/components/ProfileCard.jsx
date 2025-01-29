import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

function ProfileCard({ user, onSave, onCancel }) {
  const [username, setUsername] = useState(user?.name || '');
  const [email] = useState(user?.email || ''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setError('');
    onSave({ username, email, password });
  };
  

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-2xl space-y-4">
      <div>
        <label className="block text-left mb-1">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="cursor-not-allowed w-full text-gray-600 border border-1 p-2 rounded bg-gray-50"
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
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 bg-transparent top-1/2 transform -translate-y-1/2 text-xl"
          >
            {showPassword ? <VscEyeClosed /> : <VscEye />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-left mb-1">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute bg-transparent right-2 top-1/2 transform -translate-y-1/2 text-xl"
          >
            {showConfirmPassword ? <VscEyeClosed /> : <VscEye />}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4">
        <button type="submit" className="primary max-w-sm">
          Save Changes
        </button>
        <button type="button" onClick={onCancel} className="primary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProfileCard;
