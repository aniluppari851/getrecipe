import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="auth-container container">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <h1 className="title-huge">Welcome Back</h1>
                    <p className="subtitle">Sign in to sync your favorite recipes.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={20} />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group mt-4">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={20} />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit mt-6"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="spinner" size={20} /> : <><ArrowRight size={20} /> Sign In</>}
                    </button>
                </form>

                <div className="auth-footer mt-6">
                    <p>Don't have an account? <Link to="/signup" className="text-gradient">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
