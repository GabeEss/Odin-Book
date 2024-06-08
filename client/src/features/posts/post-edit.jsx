// id is the page id
const handleEditPost = async (event, socket, setEdit, id, postId, edit) => {
    event.preventDefault();

    if(!socket) {
        console.log("No socket provided.")
        return;
    }

    if (!edit) { 
        console.log("Edit was empty.");
        return;
    }

    if(!id) {
        console.log("No page reference provided.")
        return;
    }

    const postData = {
        to: id,
        post: postId,
        content: edit
    }
    console.log("Edit sent");
    socket.emit('editPost', postData);
    setEdit('');
}

export default handleEditPost;