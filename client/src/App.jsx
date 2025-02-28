import { Routes, Route} from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";

import ProfilePage from "./pages/ProfilePage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacesPage from "./pages/PlacesPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import Hero from "./components/Hero";
import CreateTrip from "./create-trip";
import ViewTrip from "./view-trip/[tripId]/index.jsx";
import MyTrips from "./my-trips";

import React from "react";
import { Toaster } from "./components/ui/sonner";
import { UserContextProvider } from "./UserContext";

// Use the VITE_BASE_URL from the .env file
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
 

  return (
    <UserContextProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hero />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />

          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
