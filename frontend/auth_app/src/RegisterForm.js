import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from './api';
import { Link } from 'react-router-dom';
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
            setLoading(true);
            const registerResponse = await registerUser(username, password);
            setLoading(false);
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
        <div className="flex flex-col items-center justify-center p-8 h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center max-w-md w-full bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <form onSubmit={handleRegister} className="flex flex-col gap-4 p-8 rounded-lg bg-white shadow-lg w-[300px] sm:w-11/12">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        />
                        <span 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-blue-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    
                    <div className="relative w-full">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        />
                        <span 
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-blue-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>

                    <button type="submit" className="bg-green-500 text-white border-none py-2 px-4 rounded-md cursor-pointer text-lg font-bold hover:bg-green-700 transition-colors" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    {success && <p className="text-center text-sm text-green-500">{success}</p>}
                </form>
                <p className="mt-4">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
