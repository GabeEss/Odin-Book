// id is the page id
const handleEditPost = async (event, socket, setEdit, id, postId, edit) => {
    event.preventDefault();
    if (!edit) { 
        console.log("Edit was empty.");
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