import React from "react";
import { Link } from "react-router-dom";

function Hero() {
    return (
        <>


            <div className="flex flex-col items-center px-6 sm:px-12 md:px-16 lg:px-24 py-16">
                <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-center mb-6">
                    <span className="text-primary">Unleash Your Next Adventure with AI:</span>
                    <br />
                    Tailored Itineraries at Your Fingertips
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 text-center mb-6">
                    Your Ultimate Travel Companion: Curated Itineraries Designed to Fit Your Unique Interests and Budget.
                </p>
               <div className="mt-6 justify-between flex lg:flex-row md:flex-row flex-col items-center gap-10">
                 <Link to={'/index'}>
                    <button className="px-4 py-3 rounded-2xl bg-primary text-white">
                    Book Your Stay
                    </button>
                </Link>
                <Link to={'/create-trip'}>
                    <button className="px-4 py-3 rounded-2xl bg-primary text-white">
                    Discover Experiences
                    </button>
                </Link>
                </div>
            </div>
        </>
    
  );

}

export default Hero;
