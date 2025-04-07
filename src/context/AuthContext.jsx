// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // ← new
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (token && userId) {
        setUser({ token, userId });
      }
  
      setLoading(false); // ← done hydrating
    }, []);
  
    const register = async (data) => {
      const res = await axios.post('http://localhost:5050/api/auth/register', data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      setUser({ token, userId: user.id });
    };
  
    const login = async (credentials) => {
      const res = await axios.post('http://localhost:5050/api/auth/login', credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      setUser({ token, userId: user.id });
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, setUser, register, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };  
