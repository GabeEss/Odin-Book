const jwt = require('jsonwebtoken');

function decodeToken(authHeader) {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);
    return decodedToken.sub; // 'sub' contains the user ID in Auth0
}

module.exports = decodeToken;