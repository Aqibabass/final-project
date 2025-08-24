import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoadingButton({ children, isLoading, ...props }) {
  return (
    <button 
      className="primary relative" 
      disabled={isLoading} 
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={isLoading ? 'invisible' : ''}>
        {children}
      </span>
    </button>
  );
}

function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 relative">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-red-400 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SuccessAlert({ message }) {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(ev) {
    ev.preventDefault();
    setError('');
    setSuccess(false);
    
    // Validation
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/register', {
        name,
        email,
        password,
      });
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Registration failed. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 w-full max-w-md px-4">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          {error && (
            <ErrorAlert 
              message={error} 
              onDismiss={() => setError('')}
            />
          )}
          
          {success && (
            <SuccessAlert message="Registration successful! Redirecting to login..." />
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          <LoadingButton 
            type="submit" 
            isLoading={loading}
            disabled={loading}
          >
            Register
          </LoadingButton>

          <div className="text-center py-2 text-gray-500">
            Already a member?{' '}
            <Link 
              className="underline text-black hover:text-primary transition-colors" 
              to={'/login'}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
