const jwt = require('jsonwebtoken');

const secretKey = `${process.env.SECRET_KEY}`;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
