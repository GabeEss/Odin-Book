const jwt = require('jsonwebtoken');

// Get info from a jwt
const decodeToken = async (authHeader) => {
    if (!authHeader || !authHeader.includes(' ')) {
        throw new Error('Invalid authorization header');
    }
    const accessToken = authHeader.split(" ")[1];

    const response = jwt.decode(accessToken, process.env.AUTH_SECRET);

    return response;
}

module.exports = decodeToken;