const handleCommentLike = async (socket, currentUser, postId, commentId, likeUnlike) => {

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if (!currentUser) { 
        console.log("No user provided.");
        return;
    }

    if(!postId) {
        console.log("No post ID provided");
        return;
    }
    
    if(!commentId) {
        console.log("No comment ID provided.");
        return;
    }

    if(!likeUnlike) {
        console.log("Like status not provided.");
        return;
    }

    const commentData = {
        from: currentUser,
        to: postId,
        comment: commentId,
        likeUnlike: likeUnlike
    }
    console.log(`Comment ${likeUnlike} sent.`);
    socket.emit('likeComment', commentData);
}

export default handleCommentLike;