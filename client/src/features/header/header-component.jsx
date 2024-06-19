import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { NotificationsContext } from './notifications/notifications-context';
import { handleGetUser } from './get-current-user';
import SearchbarComponent from "./searchbar/searchbar-component";
import NotificationsList from './notifications/notifications-list-display';
import MessageModal from '../messages/message-modal';

const socket = io(`${import.meta.env.VITE_API_URL}`);

function HeaderComponent() {
    const {
        logout,
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();
    const {guestInit, setGuestInit} = useContext(GuestInitializeContext);
    const {notifications, setNotifications} = useContext(NotificationsContext); // shows if user has a notification
    const {guest} = useContext(GuestContext);
    const location = useLocation();
    const nav = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // mongo user
    const [authUser, setAuthUser] = useState(null); // guest or auth user
    const [openNotifications, setOpenNotifications] = useState(false); // opens notification display component
    const [isOpen, setIsOpen] = useState(false); // Determines if the message modal is open
    const [modalUser, setModalUser] = useState(null);

    useEffect(() => {
        handleGetUser(getAccessTokenSilently, guest, guestInit, setCurrentUser);
    }, []);

    useEffect(() => {
        if(!authUser || !currentUser) {
            return; 
        }

        socket.emit('userJoined', authUser);
        socket.emit('userJoinsHasNotification', currentUser._id);

        socket.on('notification', () => {
            setNotifications(true);
        });
    
        return() => {
            socket.emit('userLeft', authUser);
            socket.emit('userLeavesHasNotification', currentUser._id);
            socket.off('notification');
        }
    }, [authUser, currentUser, location]);

    const handleLogout = () => {
        if(isAuthenticated) {
            logout({ returnTo: window.location.origin });
        }

        if(guestInit) {
            setGuestInit(false);
            nav('/');
            // Clear the guestId cookie, which is set in the backend
            Cookies.remove('guestId');
        }
    }

    // Initializes current user
    useEffect(() => {
        if(guestInit) setAuthUser(guest);
        else setAuthUser(user.sub);
    }, [user]);

    const handleNotificationClick = () => {
        setNotifications(false);
        if(!openNotifications) {
            setOpenNotifications(true);
        }
        else
            setOpenNotifications(false);
    }

    const handleFriends = () => {
        nav('/friends');
    }

    const handleEvents = () => {
        nav('/events');
    }

    const handleHome = () => {
        nav('/home');
    }

    const handleUser = () => {
        nav(`/user/${currentUser._id}`);
    }

    // Handle modal closing
    const onRequestClose = () => { 
        setIsOpen(false);
    }

    return(
        <div className="header">
            <SearchbarComponent/>
            <div className="header-dropdown">
                {currentUser ? <button className="user-nav" onClick={handleUser}>User Page</button> : null}
                <button className="friends-nav" onClick={handleFriends}>Friends</button>
                <button className="events-nav" onClick={handleEvents}>Events</button>
                <button className="home-nav" onClick={handleHome}>Home</button>
                <div className='notifications-container'>
                    {notifications ? 
                    <button className="notifications-nav has-notification" onClick={handleNotificationClick}>Notifications</button> : 
                    <button className="notifications-nav" onClick={handleNotificationClick}>Notifications</button>
                    }
                    {openNotifications ?
                      <NotificationsList setOpenNotifications={setOpenNotifications} setIsOpen={setIsOpen} setModalUser={setModalUser}/>
                       : null
                    }
                </div>
                <div className="dropdown-content">
                    <button className='logout-nav' onClick={handleLogout}>
                        Log out
                    </button>
                    <button className='signup-nav' onClick={() => nav('/signup')}>Update User</button>
                </div>
            </div>
            {isOpen ? <MessageModal isOpen={isOpen} modalUser={modalUser} onRequestClose={onRequestClose}/> 
            : null }
        </div>
    )
}

export default HeaderComponent;