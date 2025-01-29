import React from 'react';
import PlaceCardItem from './PlaceCardItem'; 

function PlacesToVisit({ trip }) {
    return (
        <div>
            <h2 className="font-bold text-xl mt-10">Places to Visit</h2>
            <div>
                {Object.entries(trip.tripData?.itinerary || {})
                    .map(([dayKey, day], index) => {
                        return (
                            <div key={index} >
                                <h2 className="font-medium text-lg mt-6">
                                    {`Day ${index + 1}`}
                                </h2>
                                <p className="text-orange-600 mt-1 mb-4">Best Time to Visit: {day.bestTimeToVisit}</p>
                                <div className="grid md:grid-cols-2  gap-5 ">
                                    {day.places.map((place, idx) => (
                                        <PlaceCardItem key={idx} place={place} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default PlacesToVisit;
