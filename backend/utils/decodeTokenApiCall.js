const axios = require('axios');

// Get info from an opaque token, call Auth0 API
const decodeTokenApi = async (authHeader) => {
    if (!authHeader || !authHeader.includes(' ')) {
        throw new Error('Invalid authorization header');
    }
    const accessToken = authHeader.split(" ")[1];

    const response = await axios.get(process.env.AUTH_ISSUER + "/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
}

module.exports = decodeTokenApi;