import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, Heart, Compass, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <header className="navbar-container glass-panel">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon-wrapper">
                        <ChefHat size={24} className="logo-icon" />
                    </div>
                    <span className="logo-text">TryRecipe</span>
                </Link>
                <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        <Compass size={20} />
                        <span>Explore</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
                                <Heart size={20} />
                                <span>Saved</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="nav-link logout-btn"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)' }}
                            >
                                <LogOut size={20} />
                                <span>Log Out</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                            <LogIn size={20} />
                            <span>Log In</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
