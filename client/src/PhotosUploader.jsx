
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { FaRegTrashAlt } from 'react-icons/fa';
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

function PhotosUploader({ addedPhotos, onChange }) {
    const [photoLink, setPhotoLink] = useState('');

    async function addPhotoByLink(ev) {
        ev.preventDefault();
        if (!photoLink.trim()) { // Validate empty input
          alert('Please provide a valid image URL');
          return;
        }
        try {
          const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
          onChange(prev => {
            return [...prev, filename];
          });
          setPhotoLink('');
        } catch (error) {
          alert('Failed to add photo. Please check the URL and try again.');
        }
      }
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            const { data: filenames } = response;
            onChange(prev => {
                return [...prev, ...filenames];
            });

        })
    }
    function removePhoto(ev, filename) {
        ev.preventDefault();
        onChange([...addedPhotos
            .filter(photo => photo !== filename)]);
    }
    function selectAsMainPhoto(ev, filename) {
        ev.preventDefault();

        onChange([filename, ...addedPhotos
            .filter(photo => photo !== filename)]);
    }
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return (
        <>
            <div className='flex gap-2'>
                <input type="text"
                    value={photoLink}
                    onChange={ev => setPhotoLink(ev.target.value)}
                    placeholder='Add using a link ....jpg' />
                <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'>Add&nbsp;photo</button>
            </div>

            <div className=' mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>

                {addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className='h-auto w-auto aspect-video flex relative' key={link}>
                         <img
                            className="rounded-2xl w-full object-cover"
                            src={`${baseUrl}/uploads/${link}`} // dynamically use base URL
                            alt=""
                        />

                        <button onClick={ev => removePhoto(ev, link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black opacity-50 rounded-2xl py-2 px-3">
                            <FaRegTrashAlt />
                        </button>

                        <button onClick={ev => selectAsMainPhoto(ev, link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black opacity-50 rounded-2xl py-2 px-3">
                            {link === addedPhotos[0] && (

                                <GoStarFill />


                            )}
                            {link !== addedPhotos[0] && (

                                <GoStar />


                            )}



                        </button>
                    </div>
                ))}

                <label className=' h-auto w-auto cursor-pointer flex items-center border justify-center gap-1 bg-transparent rounded-2xl  text-2xl p-2 text-gray-600'>
                    <input type="file" multiple className='hidden' onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </label>
            </div >
        </>

    )
}

export default PhotosUploader
