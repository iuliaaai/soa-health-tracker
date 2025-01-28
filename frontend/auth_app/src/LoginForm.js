import { useState } from 'react';
import { loginUser } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await loginUser(username, password);
            // alert('Login successful!');
            localStorage.setItem('token', result.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center p-8 h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center max-w-md w-full bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-4 p-8 rounded-lg bg-white shadow-lg w-[300px] sm:w-11/12"
                >
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white border-none py-2 px-4 rounded-md cursor-pointer text-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                </form>

                <p className="mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}