import { useEffect, useState, useRef } from "react";
import handleDeleteMessage from "./delete-message";

function MessageList({socket, messages, user, guest, currentUser, id}) {
    const [numItems, setNumItems] = useState(-5);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load more messages when scrolling to top
    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        if(scrollTop === 0 && !isLoading && Math.abs(numItems) < messages.length) {
            setIsLoading(true);
            setTimeout(() => {
                setNumItems(prevNumItems => prevNumItems - 5);
                setIsLoading(false);
            }, 1000);
        }
    };

    // Scroll to bottom of messages
    useEffect(() => {
        if(messagesEndRef.current) 
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, [messages]);

    const handleDeleteClick = async (messageId) => {
        await handleDeleteMessage(socket, currentUser, id, messageId);
    }

    return(
        <div className="messages-container" onScroll={handleScroll} ref={messagesEndRef}>
            {isLoading && <div>Loading...</div>}
            {messages.slice(numItems).map((message, index) => (
                <div key={index}>
                    {message.sender && (message.sender.userId === user.sub ||
                    message.sender.userId === guest ? 
                    <div className='rightside-message'>
                        <p>{message.message}</p> 
                        <p>Sent by you.</p>
                        <button onClick={() => handleDeleteClick(message._id)}>Delete</button>
                    </div> :
                    <div className='leftside-message'>
                        <p>{message.message}</p>
                        <p>Sent by {message.sender.username}</p>
                    </div>)}
                </div>
            ))}
        </div>
    )
}

export default MessageList;