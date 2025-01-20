import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useCallback } from 'react';

export function Dashboard() {
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem('token');  // Remove token on logout
    //     sessionStorage.clear(); 
    //     navigate('/');  // Redirect to login page
    // };
    const handleLogout = useCallback(() => {
        try {
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [navigate]);


    // Function to check token expiration and handle automatic logout
    const checkTokenExpiration = useCallback(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp < Date.now() / 1000) {
                    alert("Session expired. Please log in again.");
                    handleLogout();
                } else {
                    const remainingTime = (decoded.exp * 1000) - Date.now();
                    setTimeout(() => {
                        alert("Session expired. Please log in again.");
                        handleLogout();
                    }, remainingTime);
                }
            } catch (error) {
                console.error("Error decoding token", error);
                handleLogout();
            }
        }
    }, [handleLogout]);

    useEffect(() => {
        checkTokenExpiration();
    }, [checkTokenExpiration]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Dashboard</h1>
            <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '18px' }}>
                Logout
            </button>
        </div>
    );
}



