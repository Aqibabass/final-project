import React from 'react';

function PlaceImg({ place, index = 0, className = 'object-cover' }) {
    if (!place.photos?.length) {
        return null; 
    }

    return (
        <div>
            <img
                className={className}
                src={place.photos[index]} // Use the photo URL directly
                alt={place.title}
            />
        </div>
    );
}

export default PlaceImg;