import React, { useState, useEffect, useCallback } from 'react';
import { getMetrics, submitMetric, deleteMetric } from '../services/api';
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
        <div className="dashboard-container">
            <div className="header">
                {showMessage && <p className="message-box">{message}</p>}
                <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="logout-button">
                    Logout
                </button>
            </div>

            <h1>Health Tracker Dashboard</h1>

            {metrics.length === 0 ? <p>No metrics available</p> : 
                <table>
                    <thead>
                        <tr>
                            <th>Steps</th>
                            <th>Water (liters)</th>
                            <th>Sleep (hours)</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric) => (
                            <tr key={metric.id}>
                                <td>{metric.steps}</td>
                                <td>{metric.water}</td>
                                <td>{metric.sleep}</td>
                                <td>{new Date(metric.date).toLocaleDateString()}</td>
                                <td>
                                    <FaTrash onClick={() => handleDelete(metric.id)} style={{ cursor: 'pointer', color: 'red' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

            <FaPlus onClick={() => setShowForm(true)} className="add-icon" />
            
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Steps" onChange={(e) => setSteps(e.target.value)} required />
                    <input type="number" step="0.1" placeholder="Water (liters)" onChange={(e) => setWater(e.target.value)} required />
                    <input type="number" step="0.1" placeholder="Sleep (hours)" min="1" max="24" onChange={(e) => setSleep(e.target.value)} required />
                    <input type="date" onChange={(e) => setDate(e.target.value)} required />
                    <div className="btns-container">
                        <button className="save-btn" type="submit">Save</button>
                        <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}