const handleDeleteMessage = async (socket, currentUser, id, messageId) => {
    if(!socket) {
        console.log("Empty socket.");
        return;
    }

    if(!currentUser) {
        console.log("No current user.");
        return;
    }

    if(!id) {
        console.log("No recipient id.");
        return;
    }

    if (!messageId) { 
        console.log("No message ID provided.");
        return;
    }

    const messageData = {
        from: currentUser,
        to: id,
        messageId: messageId,
    }

    console.log("Message delete sent");
    socket.emit('deleteMessage', messageData);
}

export default handleDeleteMessage;