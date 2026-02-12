import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">LM</div>
                    <span className="logo-text">LearnMetrics</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/auth?mode=signup" className="btn-primary">Get Started</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
