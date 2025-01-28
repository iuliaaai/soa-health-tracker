import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;  // Check token expiration
    } catch (error) {
        return false;
    }
};

export function ProtectedRoute() {
    return isTokenValid() ? <Outlet /> : <Navigate to="/" replace />;
}
