const User = require('../models/User');

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ fullName, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user: { id: user._id, fullName, email, role: user.role, isNewUser: user.isNewUser } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, isNewUser: user.isNewUser } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
