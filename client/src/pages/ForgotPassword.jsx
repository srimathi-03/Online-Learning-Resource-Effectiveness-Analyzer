import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';
import api from '../services/api';

const STEPS = { EMAIL: 'email', OTP: 'otp', RESET: 'reset', SUCCESS: 'success' };

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // 1 minute in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [shownOtp, setShownOtp] = useState(''); // OTP displayed on screen
    const otpRefs = useRef([]);

    // Countdown timer
    useEffect(() => {
        if (!timerActive || timer <= 0) return;
        const id = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [timerActive, timer]);

    const formatTimer = (s) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    // ---------- Step 1: Send OTP ----------
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await api.forgotPassword(email);
            setStep(STEPS.OTP);
            setTimer(60);
            setTimerActive(true);
            // Show OTP on screen (returned from backend)
            if (data.otp) {
                setShownOtp(data.otp);
                // Auto-fill OTP boxes
                setOtp(data.otp.split(''));
            }
            setTimeout(() => otpRefs.current[5]?.focus(), 100);
        } catch {
            setError('Could not send OTP. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // ---------- OTP Input Handling ----------
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            setOtp(paste.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    // ---------- Step 2: Verify OTP ----------
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }
        if (timer <= 0) {
            setError('OTP expired. Please request a new one.');
            return;
        }
        setLoading(true);
        try {
            const data = await api.verifyOtp(email, otpString);
            if (data.resetToken) {
                setResetToken(data.resetToken);
                setTimerActive(false);
                setStep(STEPS.RESET);
            } else {
                setError(data.message || 'OTP verification failed.');
            }
        } catch {
            setError('Could not verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ---------- Step 3: Reset Password ----------
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const data = await api.resetPassword(email, resetToken, newPassword);
            if (data.message && data.message.toLowerCase().includes('successfully')) {
                setStep(STEPS.SUCCESS);
            } else {
                setError(data.message || 'Reset failed. Please try again.');
            }
        } catch {
            setError('Could not reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        setLoading(true);
        try {
            const resendData = await api.forgotPassword(email);
            setTimer(60);
            setTimerActive(true);
            if (resendData.otp) {
                setShownOtp(resendData.otp);
                setOtp(resendData.otp.split(''));
            }
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch {
            setError('Could not resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    // ---------- Step Config ----------
    const stepConfig = {
        [STEPS.EMAIL]: { icon: Mail, title: 'Forgot Password', subtitle: "Enter your email and we'll send you a secure OTP" },
        [STEPS.OTP]: { icon: ShieldCheck, title: 'Verify OTP', subtitle: `Enter the 6-digit code sent to ${email}` },
        [STEPS.RESET]: { icon: Lock, title: 'New Password', subtitle: 'Choose a strong new password' },
        [STEPS.SUCCESS]: { icon: KeyRound, title: 'All Done!', subtitle: 'Your password has been reset successfully' },
    };
    const { icon: StepIcon, title, subtitle } = stepConfig[step];

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Progress Bar */}
                {step !== STEPS.SUCCESS && (
                    <div className="fp-progress-bar">
                        {[STEPS.EMAIL, STEPS.OTP, STEPS.RESET].map((s, i) => (
                            <div
                                key={s}
                                className={`fp-progress-step ${[STEPS.EMAIL, STEPS.OTP, STEPS.RESET].indexOf(step) >= i ? 'active' : ''
                                    }`}
                            />
                        ))}
                    </div>
                )}

                <div className="auth-header">
                    <div className="logo-icon">
                        <StepIcon size={20} />
                    </div>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>

                {error && <div className="auth-error-msg">{error}</div>}

                {/* ---- STEP 1: Email ---- */}
                {step === STEPS.EMAIL && (
                    <form className="auth-form" onSubmit={handleSendOtp}>
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
                                    autoFocus
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {/* ---- STEP 2: OTP ---- */}
                {step === STEPS.OTP && (
                    <form className="auth-form" onSubmit={handleVerifyOtp}>
                        <div className="fp-otp-row" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (otpRefs.current[i] = el)}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className={`fp-otp-box ${digit ? 'filled' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="fp-timer-row">
                            {timer > 0 ? (
                                <span className="fp-timer">
                                    <ShieldCheck size={14} /> Expires in {formatTimer(timer)}
                                </span>
                            ) : (
                                <span className="fp-timer expired">OTP expired</span>
                            )}
                            <button
                                type="button"
                                className="fp-resend-btn"
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                            </button>
                        </div>

                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {/* ---- STEP 3: New Password ---- */}
                {step === STEPS.RESET && (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {/* Strength indicator */}
                        {newPassword.length > 0 && (
                            <div className="fp-strength">
                                <div className={`fp-strength-bar ${newPassword.length < 6 ? 'weak' : newPassword.length < 10 ? 'medium' : 'strong'}`} />
                                <span>{newPassword.length < 6 ? 'Too short' : newPassword.length < 10 ? 'Medium' : 'Strong'}</span>
                            </div>
                        )}
                        <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {/* ---- SUCCESS ---- */}
                {step === STEPS.SUCCESS && (
                    <div className="fp-success">
                        <div className="fp-success-icon">✓</div>
                        <p>Your password has been updated. You can now sign in with your new credentials.</p>
                        <button
                            className="btn-primary auth-submit"
                            onClick={() => navigate('/auth')}
                        >
                            Back to Sign In <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {step !== STEPS.SUCCESS && (
                    <div className="auth-footer">
                        <p>
                            Remember it?
                            <button className="auth-toggle" onClick={() => navigate('/auth')}>
                                Back to Login
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
