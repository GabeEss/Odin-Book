// id is the page id
const handlePostLike = async (socket, currentUser, id, postId, likeUnlike) => {

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if (!currentUser) { 
        console.log("No user provided.");
        return;
    }

    if(!id) {
        console.log("No page reference provided.")
        return;
    }

    if(!postId) {
        console.log("No post ID provided");
        return;
    }

    if(!likeUnlike) {
        console.log("Like status not provided.");
        return;
    }

    const postData = {
        from: currentUser,
        to: id,
        post: postId,
        likeUnlike: likeUnlike
    }
    console.log(`${likeUnlike} sent.`);
    socket.emit('likePost', postData);
}

export default handlePostLike;