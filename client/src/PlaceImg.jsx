import React from 'react';

function PlaceImg({ place, index = 0, className = 'object-cover' }) {
    if (!place.photos?.length) {
        return null; 
    }

    return (
        <div>
            <img
                className={className}
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${place.photos[index]}`}
                alt={place.title}
            />
        </div>
    );
}

export default PlaceImg;
