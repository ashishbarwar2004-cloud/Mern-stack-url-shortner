// client/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Remove the import for './Navbar.css'

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        // nav: The main navbar container
        // - bg-gray-800: A dark background.
        // - text-white: Sets the text color to white.
        // - p-4: Applies 1rem of padding on all sides.
        // - shadow-md: Adds a medium box shadow for depth.
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            {/* div: A container to hold the content, centered with a max-width */}
            {/* - container mx-auto: Centers the content and applies max-width. */}
            {/* - flex justify-between items-center: The core of our flexbox layout. */}
            <div className="container mx-auto flex justify-between items-center">
                {/* div: The brand/logo section */}
                {/* - text-2xl: Sets a larger font size. */}
                {/* - font-bold: Makes the font bold. */}
                <div className="text-2xl font-bold">
                    <Link to="/">Short.ly</Link>
                </div>

                {/* ul: The list of navigation links */}
                {/* - flex gap-4 items-center: Lays out the links horizontally with 1rem of space. */}
                <ul className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <li>
                                {/* hover:text-blue-300: Changes text color on hover for feedback. */}
                                <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="hover:text-blue-300">Login</Link></li>
                            <li><Link to="/register" className="hover:text-blue-300">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;