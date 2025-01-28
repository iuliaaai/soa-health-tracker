import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://127.0.0.1:8000/auth/login';
const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const loginUser = async (username, password) => {
    try {
        // Use URLSearchParams to format the data as application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(API_URL+'/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Login failed';
    }
};

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(API_URL+'/auth/register', 
            { username, password }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Registration failed';
    }
};


// Add an interceptor to check token expiry before each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            window.location.href = '/';  // Redirect to login
            throw new Error('Token expired');
        }

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
