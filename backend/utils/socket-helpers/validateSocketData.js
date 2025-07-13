function validateMessageData(data) {
    const errors = [];

    if(!data.from) errors.push('Message error. Missing message sender ID.');
    if(!data.to) errors.push('Message error. Missing message recipient ID.');
    if(!data.message || data.message.trim() === '') errors.push('Message error. Missing message data.');

    return {
        isValid: errors.length === 0,
        errors
    }
}

function validatePostData(data) {
    const errors = [];

    if(!data.from) errors.push('Post error. Missing post sender ID.');
    if(!data.to) errors.push('Post error. Missing post recipient ID.');
    if(!data.post || data.post.trim() === '') errors.push('Post error. Missing post data.');

    return {
        isValid: errors.length === 0,
        errors
    }
}

function validateCommentData(data) {
    const errors = [];

    if(!data.from) errors.push('Comment error. Missing comment sender ID.');
    if(!data.to) errors.push('Comment error. Missing post ID.');
    if(!data.comment || data.comment.trim() === '') errors.push('Comment error. Missing comment data.');

    return {
        isValid: errors.length === 0,
        errors
    }
}

function validatePostLikeData(data) {
    const errors = [];

    if(!data.from) errors.push('Like post error. Missing sender ID.');
    if(!data.post) errors.push('Like post error. Missing post ID.');
    if(!data.to) errors.push('Like post error. Missing recipient ID.');
    if(data.likeUnlike !== 'like' || data.likeUnlike !== 'unlike')
        errors.push('Like post error. Invalid like status.');

    return {
        isValid: errors.length === 0,
        errors
    }
}

function validateCommentLikeData(data) {
    const errors = [];

    if(!data.from) errors.push('Like comment error. Missing sender ID.');
    if(!data.to) errors.push('Like comment error. Missing post ID.')
    if(!data.comment) errors.push('Like comment error. Missing comment ID');
    if(data.likeUnlike !== 'like' || data.likeUnlike !== 'unlike')
        errors.push('Like comment error. Invalid like status.');

    return{
        isValid: errors.length === 0,
        errors
    }
}


module.exports = {
    validateMessageData,
    validatePostData,
    validateCommentData,
    validatePostLikeData,
    validateCommentLikeData
}