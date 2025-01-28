import React, { useState, useEffect, useCallback } from 'react';
import { getMetrics, submitMetric, deleteMetric } from './api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

export function Dashboard() {
    const [metrics, setMetrics] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [steps, setSteps] = useState('');
    const [water, setWater] = useState('');
    const [sleep, setSleep] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const fetchMetrics = useCallback(async () => {
        try {
            const data = await getMetrics();
            setMetrics(data);
        } catch (error) {
            setMetrics([]);
            setMessage('No metrics available');
            setShowMessage(true);
            hideMessageAfterDelay();
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMetric = {
            steps: parseInt(steps),
            water: parseFloat(water),
            sleep: parseFloat(sleep),
            date: date,
        };

        try {
            await submitMetric(newMetric);
            setMessage('Metric added successfully!');
            setShowMessage(true);
            hideMessageAfterDelay();
            fetchMetrics();
            setShowForm(false);
        } catch (error) {
            setMessage('Error submitting metric!');
            setShowMessage(true);
            hideMessageAfterDelay();
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMetric(id);
            setMessage('Metric deleted successfully!');
            setShowMessage(true);
            hideMessageAfterDelay();
            fetchMetrics();
        } catch (error) {
            setMessage('Error deleting metric!');
            setShowMessage(true);
            hideMessageAfterDelay();
        }
    };

     const hideMessageAfterDelay = () => {
        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    };

    return (
        <div className="max-w-5xl mx-auto my-10 p-6 text-center font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                {/* Success/Error Message */}
                <div >
                    {showMessage && (
                        <p className="bg-green-100 border border-green-300 text-green-700 py-2 px-4 rounded-md shadow-md">
                            {message}
                        </p>
                    )}
                </div>

                {/* Logout Button (Aligned to Right) */}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-6">Health Tracker Dashboard</h1>

            {/* Metrics Table */}
            {metrics.length === 0 ? (
                <p className="text-gray-600">No metrics available</p>
            ) : (
                <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
                    <thead>
                        <tr className="bg-teal-400 text-white text-lg">
                            <th className="py-3 px-6 border">Steps</th>
                            <th className="py-3 px-6 border">Water (liters)</th>
                            <th className="py-3 px-6 border">Sleep (hours)</th>
                            <th className="py-3 px-6 border">Date</th>
                            <th className="py-3 px-6 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric) => (
                            <tr key={metric.id} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{metric.steps}</td>
                                <td className="py-2 px-4">{metric.water}</td>
                                <td className="py-2 px-4">{metric.sleep}</td>
                                <td className="py-2 px-4">{new Date(metric.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 text-center">
                                    <FaTrash
                                        onClick={() => handleDelete(metric.id) }
                                        className="flex justify-center w-full text-red-500 cursor-pointer hover:text-red-700"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Centered Add Icon */}
            <div className="flex justify-center mt-5">
                <FaPlus
                    onClick={() => setShowForm(true)}
                    className="text-4xl text-blue-500 cursor-pointer hover:scale-110 transition"
                />
            </div>

            {/* Metric Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-5 p-5 flex flex-col items-center bg-gray-200 rounded-lg shadow-md w-full max-w-md mx-auto"
                >
                    <input
                        type="number"
                        placeholder="Steps"
                        onChange={(e) => setSteps(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md"
                    />
                    <input
                        type="number"
                        step="0.1"
                        placeholder="Water (liters)"
                        onChange={(e) => setWater(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md"
                    />
                    <input
                        type="number"
                        step="0.1"
                        placeholder="Sleep (hours)"
                        min="1"
                        max="24"
                        onChange={(e) => setSleep(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md"
                    />
                    <input
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-4/5 p-3 mb-4 border border-gray-300 rounded-md"
                    />
                    <div className="flex gap-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-red-500 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}