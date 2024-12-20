import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import { useContext } from 'react';

function AuthNavbar() {
    const location = useLocation(); // Helps track current route
    const navigate = useNavigate();
    const { setIsAuth } = useContext(AuthContext);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        navigate('/');
        setIsAuth(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
            </div>
            <Link to="/User">User Profile</Link>
            <div className="navbar-links">
                

                <Link 
                    to="/marketplace"
                    className={location.pathname === '/marketplace' ? 'active' : ''}
                >
                    Open Deliveries
                </Link>
                <Link 
                    to="/mydeliveries"
                    className={location.pathname === '/mydeliveries' ? 'active' : ''}
                >
                    My Deliveries
                </Link>
                <Link 
                    to="/sell"
                    className={location.pathname === '/sell' ? 'active' : ''}
                >
                    Buy
                </Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
                
                {/* Add more navigation links as needed */}
            </div>
        </nav>
    );
}

export default AuthNavbar;