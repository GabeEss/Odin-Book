import { useEffect, useState, useRef } from "react";
// import ScrollContainer from "./scrollable-container";

function MessageList({messages, user, guest}) {
    const [numItems, setNumItems] = useState(-5);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        if(messagesEndRef.current) 
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, [messages]);

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