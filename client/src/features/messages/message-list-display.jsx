import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { useMessages } from "./use-messages-hook";
import handleDeleteMessage from "./delete-message";
import handleSendMessage from "./create-message";

const socket = io(`${import.meta.env.VITE_API_URL}`);

// modalUserId is the mongo _id of the non-current user in the message exchange when using the modal
function MessageList({modalUserId}) {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {id} = useParams();
    const { data, error, isLoading } = useMessages(getAccessTokenSilently, modalUserId || id, guest, guestInit);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    const location = useLocation();

    const [numItems, setNumItems] = useState(-5);
    const [isRendering, setIsRendering] = useState(false);
    const messagesEndRef = useRef(null);

    // Load more messages when scrolling to top
    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        if(scrollTop === 0 && !isLoading && Math.abs(numItems) < messages.length) {
            setIsRendering(true);
            setTimeout(() => {
                setNumItems(prevNumItems => prevNumItems - 5);
                setIsRendering(false);
            }, 1000);
        }
    };

    // Scroll to bottom of messages
    useEffect(() => {
        if(messagesEndRef.current) 
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }, [messages]);

    // Handle user joining and leaving message chatroom
    useEffect(() => {
        if(!currentUser) return;

        // Send recipient id (mongo) and sender id (auth or guest)
        if(modalUserId) socket.emit('userJoinsMessageChat', modalUserId, currentUser);
        else socket.emit('userJoinsMessageChat', id, currentUser);

        return () => {
            if(modalUserId) socket.emit('userLeavesMessageChat', id, currentUser);
            else socket.emit('userLeavesMessageChat', id, currentUser)
            socket.off('message');
        }
    }, [currentUser]);

    // Fetches previous messages
    useEffect(() => {
        if(data) {
            setMessages(data.userMessages);
        }
    }, [data]);

    // Listens for new messages
    useEffect(() => {
        socket.on('message', (messageData) => {
            setMessages((prevMessages) => [...prevMessages, messageData])
        });

        return () => {
            socket.off('message');
        }
    }, [location]);

    // Listens for deleted messages
    useEffect(() => {
        socket.on('deleteMessage', (messageData) => {
            setMessages((prevMessages) => prevMessages.filter(message => message._id !== messageData._id));
        })

        return() => {
            socket.off('deleteMessage');
        }
    }, [location])

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user, location]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const sendMessage = async (event) => {
        if(modalUserId) await handleSendMessage(event, socket, setMessage, currentUser, modalUserId, message);
        else await handleSendMessage(event, socket, setMessage, currentUser, id, message);
    }
        
    const handleDeleteClick = async (messageId) => {
        if(modalUserId) await handleDeleteMessage(socket, currentUser, modalUserId, messageId);
        else await handleDeleteMessage(socket, currentUser, id, messageId);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

    return(
        <div className='messages-and-send-message'>
            <div className="messages-container" onScroll={handleScroll} ref={messagesEndRef}>
                {isRendering && <div>Loading...</div>}
                {messages.slice(numItems).map((message, index) => (
                    <div key={index}>
                        {message.sender && (message.sender.userId === guest || message.sender.userId === user.sub ? 
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
            <form className="send-message-container" onSubmit={sendMessage}>
                <input type="text" value={message} onChange={handleMessageChange} />
                <button type="submit">Send Message</button>
            </form>
        </div>
    )
}

export default MessageList;