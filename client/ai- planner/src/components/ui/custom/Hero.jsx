import React from 'react';
import { Button } from '../button';
import { Link } from 'react-router-dom';
import Footer from '@/components/ui/custom/Footer';

function Hero() {
  return (
    <>
      <div className="flex flex-col items-center px-6 sm:px-12 md:px-16 lg:px-24 py-16">
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center mb-6">
          <span className="text-[#f56551]">Unleash Your Next Adventure with AI:</span>
          <br />
          Tailored Itineraries at Your Fingertips
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 text-center mb-6">
          Your Ultimate Travel Companion: Curated Itineraries Designed to Fit Your Unique Interests and Budget.
        </p>
        <Link to="/create-trip">
          <Button className="text-lg px-8 py-3">Get Started, It's Free!</Button>
        </Link>
        <img src="/landing.png" alt="landing"
          className="w-full max-w-[1280px] h-auto "/>
      </div>
      <Footer />
    </>
  );
}

export default Hero;
