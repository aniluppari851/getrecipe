import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import './Auth.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://aniluppari851.github.io/getrecipe/',
            }
        });

        if (error) {
            setError(error.message);
        } else {
            // Depending on strict email confirm settings in Supabase, the user might be logged in immediately
            if (data.session) {
                navigate('/');
            } else {
                setSuccess('Success! Please check your email to confirm your account.');
                setEmail('');
                setPassword('');
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container container">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <h1 className="title-huge">Join TryRecipe</h1>
                    <p className="subtitle">Create an account to save your favorite dishes.</p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSignup} className="auth-form">
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
                        <p className="form-hint">At least 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit mt-6"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="spinner" size={20} /> : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <div className="auth-footer mt-6">
                    <p>Already have an account? <Link to="/login" className="text-gradient">Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
