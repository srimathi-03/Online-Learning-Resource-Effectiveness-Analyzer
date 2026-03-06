import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus, ShieldCheck, GraduationCap } from 'lucide-react';
import api from '../services/api';

const ROLE_CONFIG = {
    admin: {
        icon: <ShieldCheck size={32} color="#f59e0b" />,
        label: 'Admin Portal',
        subtitle: 'Sign in to manage courses, users & assessments',
        accent: '#f59e0b',
        accentBg: '#fffbeb',
        allowSignup: false,         // Admins are pre-created; no public signup
    },
    learner: {
        icon: <GraduationCap size={32} color="#4f46e5" />,
        label: 'Learner Portal',
        subtitle: 'Sign in or create a new account to start learning',
        accent: '#4f46e5',
        accentBg: '#eef2ff',
        allowSignup: true,
    },
};

const Auth = () => {
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Determine role from query param; default to 'learner'
    const role = searchParams.get('role') === 'admin' ? 'admin' : 'learner';
    const config = ROLE_CONFIG[role];

    useEffect(() => {
        const mode = searchParams.get('mode');
        // Admins can only log in, never self-signup
        if (mode === 'signup' && config.allowSignup) {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
        setError('');
    }, [searchParams, config.allowSignup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let data;
            if (isLogin) {
                data = await api.login(email, password);
            } else {
                data = await api.signup(fullName, email, password);
            }

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Role-based redirect
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection to server failed. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Role Badge */}
                <div className="auth-role-badge" style={{ background: config.accentBg, borderBottom: `3px solid ${config.accent}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {config.icon}
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{config.label}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{config.subtitle}</div>
                        </div>
                    </div>
                </div>

                <div className="auth-header" style={{ paddingTop: '1.25rem' }}>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{isLogin ? `Enter your credentials to access the ${config.label}` : 'Join LearnMetrics to track your progress'}</p>
                </div>

                {/* Back to welcome */}
                <button
                    className="auth-back-link"
                    style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back to home
                </button>

                {error && <div className="auth-error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <UserPlus className="input-icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-label-row">
                            <label>Password</label>
                            {isLogin && (
                                <Link to="/forgot-password" className="fp-link">Forgot Password?</Link>
                            )}
                        </div>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
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
                        className="btn-primary auth-submit"
                        disabled={loading}
                        style={{ background: config.accent }}
                    >
                        {loading ? 'Processing...' : (isLogin ? `Sign In to ${config.label}` : 'Sign Up')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                {/* Only learners can toggle to signup */}
                {config.allowSignup && (
                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                className="auth-toggle"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Create one now' : 'Log in here'}
                            </button>
                        </p>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Auth;
