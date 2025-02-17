import axios from "axios";
import { useEffect, createContext, useState } from "react";

// Function to get user data from request
function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) {
          reject(err); // Properly handle the error by calling reject
        } else {
          resolve(userData);
        }
      });
    });
  }

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/profile`);
                setUser(response.data);
                setReady(true);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setReady(true);
            }
        };

        fetchProfile();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser: updateUser, 
            ready 
        }}>
            {children}
        </UserContext.Provider>
    );
}