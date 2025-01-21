import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './RegisterForm.css';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // setLoading(true);
            const registerResponse = await registerUser(username, password);
            // setLoading(false);
            if (registerResponse.message) {
                const loginResponse = await loginUser(username, password); // automatically login

                localStorage.setItem('token', loginResponse.access_token);
                setSuccess(loginResponse.message);
                setError(null);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err || 'Registration or login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="register-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-field"
                />
                <div className="password-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                
                <div className="password-container">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button type="submit" className="register-button" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>

            <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
    );
}
