const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = '7d'; // Refresh token valid for 7 days

    if (!secretKey) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
    }

    return jwt.sign({ id: userId }, secretKey, { expiresIn });
};

module.exports = generateRefreshToken;