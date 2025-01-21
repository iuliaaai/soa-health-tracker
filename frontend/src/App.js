import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function App() {
  return (
      <div>
          {/* <nav>
                <Link to="/">Login</Link> | 
                <Link to="/dashboard">Dashboard</Link>
            </nav> */}

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
      </div>
  );
}