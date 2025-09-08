const decodeToken = require("./decodeToken");
const {getUserInfo} = require("./getUserInfo");

// Function to determine whether the user is a guest or a logged in user
// Returns the user object from mongo if it exists, otherwise returns null
async function determineUserType(req) {
    if(req.headers.authorization) {
        const tokenResponse = await decodeToken(req.headers.authorization);
        mongoUser = await getUserInfo(tokenResponse.sub);
        return mongoUser;
    } else if(req.headers['x-guest']){
        mongoUser = await getUserInfo(req.headers['x-guest']);
        return mongoUser;
    } else {
        return null;
    }
}

module.exports = determineUserType;