const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

// ------ helpers ------
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Brevo (Sendinblue) SMTP transporter
const createBrevoTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_SMTP_KEY,
        },
    });
};

// ------ signup validation rules ------
exports.signupValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ------ login validation rules ------
exports.loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// ------ signup ------
exports.signup = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { fullName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ fullName, email, password });
        await user.save(); // bcrypt hook hashes password here

        const token = signToken(user);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user._id, fullName, email, role: user.role, isNewUser: user.isNewUser },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ------ login ------
exports.login = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user);

        res.json({
            message: 'Login successful',
            token,
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
            return res.json({
                message: 'OTP sent.',
                devOtp: null
            });
        }

        const otp = generateOtp();
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.resetToken = null;
        await user.save();

        console.log(`\n🔑 OTP for ${email}: ${otp}\n`);

        res.json({
            message: 'OTP generated successfully.',
            otp: otp
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

        user.password = newPassword; // bcrypt hook hashes it on save
        user.resetToken = null;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
