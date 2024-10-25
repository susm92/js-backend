const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post(
    '/register',
    [
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
        try {
            await User.createUser(req, res);
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

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }
        const token = jwt.sign({ id: user._id }, `${process.env.SECRET_KEY}`, { expiresIn: '1h' });

        return res.json({ token });
    })(req, res, next);
});

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {

    return res.json({
        message: 'You have access to this protected route',
        user: req.user
    });
});

module.exports = router;
