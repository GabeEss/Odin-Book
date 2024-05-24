import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import {useNavigate,useParams} from 'react-router-dom';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";
import { useMessages } from "../features/messages/useMessagesHook";
import MessageList from "../features/messages/message-list-display";
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

    // Set up user for socket, handle user joining and leaving
    useEffect(() => {
        if(!currentUser) return;

        socket.emit('userJoined', currentUser);

        return () => {
            socket.emit('userLeft', currentUser);
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
    }, []);

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

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const messageData = {
            from: currentUser,
            to: id,
            message: message
        }
        console.log("Message sent");
        socket.emit('sendMessage', messageData);
        setMessage('');
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>An error occurred: {error.message}</div>;
    }

    return(
        <div>
            <button onClick={handleHome}>Home</button>
            <MessageList messages={messages} user={user} guest={guest}/>
            {/* <MessageModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                messages={data.userMessages || []}
            /> */}
            <form onSubmit={handleSendMessage}>
                <input type="text" value={message} onChange={handleMessageChange} />
                <button type="submit">Send Message</button>
            </form>
        </div>
    )
}

export default MessagingPage;