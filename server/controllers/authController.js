const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ------ helpers ------
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Brevo (Sendinblue) SMTP — no Gmail 2FA needed, free 300 emails/day
const createBrevoTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,   // your Brevo account email
            pass: process.env.BREVO_SMTP_KEY, // SMTP key from Brevo dashboard
        },
    });
};

// ------ signup ------
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ fullName, email, password });
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, fullName, email, role: user.role, isNewUser: user.isNewUser },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------ login ------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isNewUser: user.isNewUser,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------ Step 1: Request OTP ------
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Still return fake success (security: don't reveal if email exists)
            return res.json({
                message: 'OTP sent.',
                devOtp: null  // null means email not found
            });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.resetToken = null;
        await user.save();

        console.log(`\n🔑 OTP for ${email}: ${otp}\n`);

        // Return OTP directly in response so frontend can show it on-screen
        res.json({
            message: 'OTP generated successfully.',
            otp: otp   // Frontend displays this to the user
        });
    } catch (err) {
        console.error('forgotPassword error:', err.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ------ Step 2: Verify OTP ------
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
        }
        if (user.resetOtpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Generate a short-lived reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        res.json({ message: 'OTP verified.', resetToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------ Step 3: Reset Password ------
exports.resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.resetToken || user.resetToken !== resetToken) {
            return res.status(400).json({ message: 'Invalid or expired reset session. Please start again.' });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        user.password = newPassword;
        user.resetToken = null;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
