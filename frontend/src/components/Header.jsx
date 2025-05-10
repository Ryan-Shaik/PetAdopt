import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { PawPrint, Menu, X, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    // Function to determine active link styling using new color palette
    const isActive = (path) => {
        const isDashboardPath = path === '/dashboard' && location.pathname.startsWith('/dashboard');
        const isAdminDashboardPath = path === '/admin/dashboard' && location.pathname.startsWith('/admin/dashboard');
        const isShelterDashboardPath = path === '/shelter/dashboard' && location.pathname.startsWith('/shelter/dashboard');

        return location.pathname === path || isDashboardPath || isAdminDashboardPath || isShelterDashboardPath
            ? 'text-teal-600 border-b-2 border-teal-600' // Use teal-600 for active state
            : 'text-gray-700 hover:text-teal-600'; // Use gray-700 and hover:teal-600
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Determine dashboard link based on role
    const getDashboardLink = () => {
        if (!user) return null;
        switch (user.role) {
            case 'Admin':
                return '/admin/dashboard';
            case 'Shelter':
                return '/shelter/dashboard';
            case 'Adopter':
            default:
                return '/dashboard';
        }
    };
    const dashboardLink = getDashboardLink();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => isMenuOpen && toggleMenu()}>
                    <PawPrint className="h-8 w-8 text-teal-600" /> {/* Use teal-600 */}
                    <span className="text-2xl font-bold text-gray-800">Pet<span className="text-teal-600">Adopt</span></span> {/* Use gray-800 and teal-600 */}
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {/* Main Links */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className={`${isActive('/')} font-medium pb-1 transition-colors duration-200`}>Home</Link>
                        <Link to="/pets" className={`${isActive('/pets')} font-medium pb-1 transition-colors duration-200`}>Find a Pet</Link>
                        {dashboardLink && (
                            <Link to={dashboardLink} className={`${isActive(dashboardLink)} font-medium pb-1 transition-colors duration-200`}>Dashboard</Link>
                        )}
                    </div>

                    {/* Auth Links */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to={dashboardLink || '/dashboard'} className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors duration-200"> {/* Use gray-700 and hover:teal-600 */}
                                    <User className="h-5 w-5" />
                                    <span>{user.name}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200" // Keep hover:red-600 for logout
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-700 hover:text-teal-600 font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center gap-1"> {/* Use gray-700 and hover:teal-600 */}
                                    <LogIn className="h-5 w-5" /> Login
                                </Link>
                                <Link to="/signup" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition duration-300 font-medium flex items-center gap-1 shadow-sm"> {/* Use amber-500 and hover:amber-600 */}
                                   <UserPlus className="h-5 w-5" /> Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-700" onClick={toggleMenu} aria-label="Toggle menu"> {/* Use gray-700 */}
                    {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </nav>

            {/* Mobile Navigation */}
            <div className={`md:hidden bg-white absolute top-full left-0 right-0 shadow-md border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="flex flex-col space-y-2 p-4">
                    <Link to="/" className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 font-medium block" onClick={toggleMenu}>Home</Link> {/* Use gray-700 and hover:bg-gray-100 */}
                    <Link to="/pets" className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 font-medium block" onClick={toggleMenu}>Find a Pet</Link>
                    {dashboardLink && (
                        <Link to={dashboardLink} className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 font-medium block" onClick={toggleMenu}>Dashboard</Link>
                    )}

                    <hr className="my-2 border-gray-200" />

                    {user ? (
                        <>
                            <Link to={dashboardLink || '/dashboard'} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 font-medium" onClick={toggleMenu}>
                                <User className="h-5 w-5" /> Profile ({user.name})
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    toggleMenu();
                                }}
                                className="flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md px-3 py-2 font-medium text-left w-full" // Keep red hover for logout
                            >
                                <LogOut className="h-5 w-5" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 font-medium" onClick={toggleMenu}>
                                <LogIn className="h-5 w-5" /> Login
                            </Link>
                            <Link to="/signup" className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition duration-300 font-medium mt-2 shadow-sm" onClick={toggleMenu}> {/* Use amber-500 and hover:amber-600 */}
                                <UserPlus className="h-5 w-5" /> Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;