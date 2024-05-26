const handleSendPost = async (event, socket, setPost, currentUser, id, post) => {
    event.preventDefault();
    if (!post) { 
        console.log("Post was empty.");
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