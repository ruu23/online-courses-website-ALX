import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userData');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
