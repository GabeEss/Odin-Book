const handleDeleteComment = async (event, socket, commentId, postId) => {
    event.preventDefault();

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if(!commentId) {
        console.log("No comment ID provided.");
        return;
    }

    if (!postId) { 
        console.log("No post ID provided.");
        return;
    }

    const deleteData = {
        to: postId,
        comment: commentId,
    }

    console.log("Comment delete sent");
    socket.emit('deleteComment', deleteData);
}

export default handleDeleteComment;