import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {useNavigate,useParams} from 'react-router-dom';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";
import { useMessages } from "../features/messages/use-messages-hook";
import MessageList from "../features/messages/message-list-display";
import handleSendMessage from "../features/messages/create-message";
import HeaderComponent from "../features/header/header-component";
// import MessageModal from "../features/messages/message-modal";

const socket = io(`${import.meta.env.VITE_API_URL}`);

function MessagingPage() {
    const {getAccessTokenSilently, user} = useAuth0();
    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const {id} = useParams();
    // const [modalIsOpen, setModalIsOpen] = useState(false);
    const { data, error, isLoading } = useMessages(getAccessTokenSilently, id, guest, guestInit);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState('');

    const nav = useNavigate();
    const location = useLocation();

    // Handle user joining and leaving message chatroom
    useEffect(() => {
        if(!currentUser) return;
        // Send recipient id (mongo) and sender id (auth or guest)
        socket.emit('userJoinsMessageChat', id, currentUser);

        return () => {
            socket.emit('userLeavesMessageChat', id, currentUser)
            socket.off('message');
        }
    }, [currentUser]);

    // // Fetches previous messages
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

    // Initializes current user
    useEffect(() => {
        if(guestInit) setCurrentUser(guest);
        else setCurrentUser(user.sub);
    }, [user.sub]);

    // function closeModal() {
    //     setModalIsOpen(false);
    // }

    const handleHome = () => {
        nav('/home');
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const sendMessage = (event) => 
        handleSendMessage(event, socket, setMessage, currentUser, id, message);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

    return(
        <div className='messages-page page'>
            <HeaderComponent/>
            <button onClick={handleHome}>Home</button>
            <MessageList messages={messages} user={user} guest={guest}/>
            {/* <MessageModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                messages={data.userMessages || []}
            /> */}
            <form onSubmit={sendMessage}>
                <input type="text" value={message} onChange={handleMessageChange} />
                <button type="submit">Send Message</button>
            </form>
        </div>
    )
}

export default MessagingPage;