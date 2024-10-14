const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); // Your updated User model
const { body, validationResult } = require('express-validator'); // For input validation
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Register route
router.post(
    '/register',
    [
        // Input validation (optional, but recommended)
        body('username')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Call the createUser function from User model
        try {
            await User.createUser(req, res);  // Handles user creation
        } catch (e) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: 'POST /register',
                    title: 'Database error',
                    message: e.message
                }
            });
        }
    }
);

// Login route
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        // Generate JWT token after successful authentication
        const token = jwt.sign({ id: user._id }, `${process.env.SECRET_KEY}`, { expiresIn: '1h' });
        return res.json({ token });
    })(req, res, next);
});

// Protected route (example)
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {

    // If authentication is successful, return the protected resource
    return res.json({
        message: 'You have access to this protected route',
        user: req.user // Contains the authenticated user data
    });
});

module.exports = router;
