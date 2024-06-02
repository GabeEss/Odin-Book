const handleDeletePost = async (event, socket, postId, postedTo) => {
    event.preventDefault();

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if (!postId) { 
        console.log("No post ID provided.");
        return;
    }

    if(!postedTo) {
        console.log("No page reference provided.")
        return;
    }

    const deleteData = {
        to: postedTo,
        post: postId,
    }

    console.log("Post delete sent");
    socket.emit('deletePost', deleteData);
}

export default handleDeletePost;