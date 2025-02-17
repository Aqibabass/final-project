import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// Create a dedicated Axios instance for Google Places
const googleAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // No cookies for Google API
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    'X-Goog-FieldMask': [
      'places.photos',
      'places.displayName',
      'places.id'
    ]
  }
});

export const GetPlaceDetails = (data) => googleAxios.post('', data); // BASE_URL is already set

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;