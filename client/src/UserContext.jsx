import axios from "axios";
import { useEffect, createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        axios.get('${import.meta.env.VITE_BASE_URL}/profile')
            .then(({ data }) => {
                setUser(data);
                setReady(true);
            })
            .catch(() => {
                setReady(true);
            });
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
