import { Routes, Route, useLocation } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
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
import { Toaster } from "./components/ui/sonner";

axios.defaults.baseURL = 'http://localhost:4000'; 

function App() {
  const location = useLocation();

  // Conditional withCredntials
  if (location.pathname === '/view-trip' || location.pathname.startsWith('/my-trips')) {
    axios.defaults.withCredentials = false;
  } else {
    axios.defaults.withCredentials = true;
  }

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
