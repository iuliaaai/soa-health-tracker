import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// const API_URL = 'http://127.0.0.1:8000/auth/login';
const API_URL = 'http://127.0.0.1:8001';

const api = axios.create({
    baseURL: API_URL,
});


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

export const getMetrics = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/metrics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to fetch metrics';
    }
};

export const submitMetric = async (metricData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/api/metrics`, metricData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Error submitting metric';
    }
};

export const deleteMetric = async (metricId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/api/metrics/${metricId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Error deleting metric';
    }
};