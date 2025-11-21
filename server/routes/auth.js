const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bad words list (basic example)
const BAD_WORDS = ['admin', 'root', 'system', 'badword1', 'badword2'];

// @route   PUT api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, async (req, res) => {
    const { username, password, theme } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update Username
        if (username && username !== user.username) {
            // Check for bad words
            const isBadWord = BAD_WORDS.some(word => username.toLowerCase().includes(word));
            if (isBadWord) {
                return res.status(400).json({ message: 'Username contains restricted words' });
            }

            // Check if username exists
            const userExists = await User.findOne({ username });
            if (userExists) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            user.username = username;
        }

        // Update Password
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            // Password hashing is handled by pre-save hook in User model
            user.password = password;
        }

        // Update Theme
        if (theme) {
            user.theme = theme;
        }

        await user.save();

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                theme: user.theme,
                points: user.points
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/reward
// @desc    Claim rewards (points)
// @access  Private
router.post('/reward', auth, async (req, res) => {
    const { action } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let pointsAwarded = 0;
        let message = '';

        if (action === 'daily_login') {
            const now = new Date();
            const lastReward = user.lastDailyReward ? new Date(user.lastDailyReward) : null;

            // Check if already claimed today
            if (lastReward &&
                lastReward.getDate() === now.getDate() &&
                lastReward.getMonth() === now.getMonth() &&
                lastReward.getFullYear() === now.getFullYear()) {
                return res.status(400).json({ message: 'Daily reward already claimed today' });
            }

            pointsAwarded = 50;
            user.points = (user.points || 0) + pointsAwarded;
            user.lastDailyReward = now;
            message = `Daily reward claimed! +${pointsAwarded} points`;
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await user.save();

        res.json({
            success: true,
            message,
            pointsAdded: pointsAwarded,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                theme: user.theme,
                points: user.points
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
