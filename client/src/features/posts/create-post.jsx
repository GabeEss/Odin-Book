const handleSendPost = async (event, socket, setPost, currentUser, id, post) => {
    event.preventDefault();

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if (!post) { 
        console.log("Post was empty.");
        return;
    }

    if(!id) {
        console.log("No page reference provided.")
        return;
    }

    const postData = {
        from: currentUser,
        to: id,
        post: post,
    }
    console.log("Post sent");
    socket.emit('sendPost', postData);
    setPost('');
}

export default handleSendPost;