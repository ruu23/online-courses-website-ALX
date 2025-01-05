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

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, pass: password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', data.username);
                localStorage.setItem('img_url', data.imgUrl);
                setUser({ user_id: data.user_id, username: data.username, imgUrl: data.imgUrl });
                // Redirect or update UI as needed
            } else {
                console.error(data.message);
                // Display error message to user
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, handleLogin }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
