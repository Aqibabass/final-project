import React from 'react';
import { MdWifi, MdLocalParking, MdTv, MdAcUnit, MdPets, MdLock } from 'react-icons/md';

function Perks({ selected, onChange }) {
    function handleCbClick(ev) {
        const { checked, name } = ev.target;
        if (checked) {
            onChange([...selected, name]);
        } else {
            onChange([...selected.filter(selectedName => selectedName !== name)]);
        }
    }

    return (
        <>
            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('wifi')}
                    name="wifi"
                    onChange={handleCbClick}
                />
                <MdWifi className="w-6 h-6" />
                <span>WiFi</span>
            </label>

            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('parking')}
                    name="parking"
                    onChange={handleCbClick}
                />
                <MdLocalParking className="w-6 h-6" />
                <span>Free Parking Spot</span>
            </label>

            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('tv')}
                    name="tv"
                    onChange={handleCbClick}
                />
                <MdTv className="w-6 h-6" />
                <span>TV</span>
            </label>

            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('ac')}
                    name="ac"
                    onChange={handleCbClick}
                />
                <MdAcUnit className="w-6 h-6" />
                <span>Air Conditioning</span>
            </label>

            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('pets')}
                    name="pets"
                    onChange={handleCbClick}
                />
                <MdPets className="w-6 h-6" />
                <span>Pets</span>
            </label>

            <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
                <input
                    type="checkbox"
                    checked={selected.includes('entrance')}
                    name="entrance"
                    onChange={handleCbClick}
                />
                <MdLock className="w-6 h-6" />
                <span>Private Entrance</span>
            </label>
        </>
    );
}

export default Perks;
