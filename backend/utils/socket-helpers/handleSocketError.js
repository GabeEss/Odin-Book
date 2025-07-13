// Use in development, not set up for logging systems yet
function handleSocketError(eventName, error, userId = null) {
    const timestamp = new Date().toISOString();
    const errorId = Math.random().toString(36).substr(2, 9);

    console.error(`[${timestamp}] Socket Error in [${errorId}] in ${eventName}:`, {
        error: error.message || error,
        userId,
        stack: error.stack
    });

    return errorId;
}

function logSocketEvent(eventName, userId, additionalData = {}) {
    console.log(`Socket Event: ${eventName}`, {
        userId,
        timestamp: new Date().toISOString(),
        ...additionalData
    });
}

module.exports = {
    handleSocketError,
    logSocketEvent
}