const handleSendComment = async (event, socket, setComment, currentUser, postId, comment) => {
    event.preventDefault();
    if (!comment) { 
        console.log("Comment was empty.");
        return;
    }

    const commentData = {
        from: currentUser,
        to: postId,
        comment: comment,
    }
    console.log("Comment sent");
    socket.emit('sendComment', commentData);
    setComment('');
}

export default handleSendComment;