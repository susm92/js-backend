const jwt = require('jsonwebtoken');

const secretKey = `${process.env.SECRET_KEY}`; // Hard-coded secret key for demonstration

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Authorization' header

    if (!token) {
        return res.status(401).json({
            error: {
                status: 401,
                title: "Unauthorized",
                message: "No token provided"
            }
        });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: {
                    status: 403,
                    title: "Forbidden",
                    message: "Invalid token"
                }
            });
        }
        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
