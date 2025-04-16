import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/users/login`,
                { email, password }
            );

            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/users`,
                { name, email, password }
            );

            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const updateUserProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/users/profile`,
                userData,
                config
            );

            setUserInfo(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            setError(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                loading,
                error,
                login,
                register,
                logout,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};