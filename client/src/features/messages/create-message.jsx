const handleSendMessage = async (event, socket, setMessage, currentUser, id, message) => {
    event.preventDefault();
    if (!message) { 
        console.log("message was empty.");
        return;
    }

    const messageData = {
        from: currentUser,
        to: id,
        message: message,
    }
    console.log("Message sent");
    socket.emit('sendMessage', messageData);
    setMessage('');
}

export default handleSendMessage;