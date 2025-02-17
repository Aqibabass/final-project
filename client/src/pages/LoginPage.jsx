import { UserContext } from '@/UserContext';
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('${import.meta.env.VITE_BASE_URL}/login', { email, password });
      setUser(data);
      setIsLoggedIn(true); // Update login status
      alert('Login successful');
      setTimeout(() => setRedirect(true), 1500); // Redirect after showing message
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/google-login', {
        token: credentialResponse.credential
      });
      setUser(response.data);
      setIsLoggedIn(true); 
      setTimeout(() => setRedirect(true), 1500);
    } catch (error) {
      setError('Google login failed');
    }
  };

  if (redirect) {
    return <Navigate to="/index" />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          {error && <p className="p-1 text-red-500 text-center">{error}</p>}
          
          {isLoggedIn && (
            <p className="p-1 text-green-500 text-center">You are logged in!</p>
          )}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              useOneTap
              render={({ onClick }) => (
                <button
                  type="button"
                  onClick={onClick}
                  className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors"
                >
                  <FcGoogle className="h-6 w-6" />
                  Continue with Google
                </button>
              )}
            />
          </div>

          <div className="text-center py-2 text-gray-500">
            Don't have an account?{' '}
            <Link className="underline text-black" to={'/register'}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
