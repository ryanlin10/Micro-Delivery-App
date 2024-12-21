import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    const location = useLocation(); // Helps track current route

    return (
        <nav className="navbar">
            <div className="navbar-brand">
            </div>
            <div className="navbar-links">
                <Link 
                    to="/" 
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    Home
                </Link>
                <Link 
                    to="/about"
                    className={location.pathname === '/about' ? 'active' : ''}
                >
                    About
                </Link>
                <Link
                    to="/register"
                    className={location.pathname === '/register' ? 'active' : ''}
                >
                    Sign Up
                </Link>

                <Link
                    to="/login"
                    className={location.pathname === '/login' ? 'active' : ''}
                >
                    Login
                </Link>
                {/* Add more navigation links as needed */}
            </div>
        </nav>
    );
}

export default Navbar;