const express = require('express');
const router = express.Router();
const mailgun = require('mailgun-js');

const authenticateToken = require('../middleware/auth.js');
//const data = require("../models/data.js");

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

router.post('/',
    authenticateToken,
    (req, res) => { 
        const { to, subject, text } = req.body;

        const data = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: to,
            subject: subject,
            text: text
        };

        mg.messages().send(data, (error, body) => {
            if (error) {
                return res.status(500).json({
                    errors: {
                        data: error,
                        message: 'Email not sent',
                    }
                });
            }
        res.status(200).json({ message: 'Email sent', body });
        });
});

module.exports = router;
