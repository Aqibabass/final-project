import { UserContext } from '@/UserContext';
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuMapPinHouse } from "react-icons/lu";
import { googleLogout } from '@react-oauth/google';

function Header({ handleSearch }) {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/logout");
      googleLogout();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="bg-white -mx-6 md:px-6 md:py-4 lg:px-7 lg:py-4 px-4 py-4">
      <header className="flex w-auto justify-between items-center relative">
        <Link to={'/index'} className="flex items-center gap-1">
          <LuMapPinHouse className='size-7' />
          <span className={`font-bold text-xl ${location.pathname !== '/index' ? 'block' : 'hidden sm:block'}`}>
            TravelMate AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {location.pathname === '/index' && (
            <div className="flex bg-transparent items-center gap-2 border border-gray-300 rounded-full py-1 px-2 shadow-md shadow-gray-300 w-[180px] sm:w-[200px] md:w-52 lg:w-72">
              <input
                type="search"
                placeholder="Search Stay"
                className=" px-2 flex-grow border-none bg-transparent outline-none text-xs sm:text-sm placeholder-gray-500 w-full"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="bg-primary mx-1 items-center text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512" className="w-4 h-4">
                  <path d="M456.69 421.39 362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 
                  48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0
                  35.3-35.3zM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8 124.95 124.95 0 0 1-124.8-124.8z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>

        {location.pathname !== '/' && (
          <div className="items-center gap-4 hidden md:flex">
            <Link to="/index" className="text-gray-600 hover:text-primary">Stays</Link>
            <Link to="/create-trip" className="text-gray-600 hover:text-primary">Experiences</Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            className="flex bg-transparent items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className={`rounded-full border border-gray-300 overflow-hidden ${!user?.avatar ? 'bg-gray-500' : ''}`}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="size-6 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 relative top-1">
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="hidden sm:block">{user?.name}</div>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <ul className="menu border bg-white rounded-box mr-6 w-max mt-2 p-4 shadow-lg z-50 absolute right-0 top-16">
          <li>
            <Link to="/index" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
              Stays
            </Link>
          </li>
          <li>
            <Link to="/create-trip" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
              Experiences
            </Link>
          </li>

          {!user ? (
            <>
              <li>
                <Link to="/login" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/account" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
                  Account
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="block text-gray-600 hover:bg-gray-200 py-2 px-4 rounded" onClick={closeMenu}>
                  My Trips
                </Link>
              </li>
              <li>
                <button
                  className="block bg-white text-gray-600 hover:bg-gray-200 hover:underline py-2 px-4 rounded"
                  onClick={() => { logout(); closeMenu(); }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default Header;
