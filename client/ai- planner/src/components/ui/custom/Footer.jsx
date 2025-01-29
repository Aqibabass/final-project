import React from 'react';

function Footer() {
  return (
    <footer className="bg-transparent py-4 ">
      <div className="container mx-auto text-center px-6 sm:px-12">
        <p className="text-gray-400 text-sm">
          Created by <span className="font-semibold text-gray-500">Aqib Mouhi Ud Din</span> | TravelMate AI App
        </p>
        <p className="text-gray-500 text-xs mt-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
