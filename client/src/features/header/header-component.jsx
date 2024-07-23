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
    const [dropdown, setDropdown] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false); // Opens the search results

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
        setDropdown(false);
        setSearchComplete(false);
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

    const handleDropdownClick = () => {
        setDropdown(!dropdown);
        setOpenNotifications(false);
        setSearchComplete(false);
    }

    return(
        <div className="header">
            <div className='user-and-search'>
                <SearchbarComponent 
                    searchComplete={searchComplete}
                    setSearchComplete={setSearchComplete}
                    setDropdown={setDropdown}
                    setOpenNotifications={setOpenNotifications}/>
            </div>
            <div className="header-dropdown">
                <div className='header-navigation-group'>
                    <button className="friends-nav header-button" onClick={handleFriends}>Friends</button>
                    <button className="events-nav header-button" onClick={handleEvents}>Events</button>
                    <button className="home-nav header-button" onClick={handleHome}>Home</button>
                </div>
                <div className='dropdown-container'>
                    {notifications ? 
                    <button className="notifications-nav has-notification header-button" onClick={handleNotificationClick}>Notifications</button> : 
                    <button className="notifications-nav header-button" onClick={handleNotificationClick}>Notifications</button>
                    }
                    {openNotifications ?
                      <NotificationsList setOpenNotifications={setOpenNotifications} setIsOpen={setIsOpen} setModalUser={setModalUser}/>
                       : null
                    }
                </div>
                <div className="dropdown-container">
                    <button className='header-button' onClick={handleDropdownClick}>...</button>
                    {dropdown ? 
                    <div className='dropdown-button-container dropdown'>
                        {currentUser ? <button className="header-button dropdown-content" onClick={handleUser}>User Page</button> : null}
                        <button className='logout-header header-button dropdown-content' onClick={handleLogout}>
                            Log out
                        </button>
                        <button className='signup-header header-button dropdown-content' onClick={() => nav('/signup')}>Update User</button>                    
                    </div> : null }
                </div>
            </div>
            {isOpen ? <MessageModal isOpen={isOpen} modalUser={modalUser} onRequestClose={onRequestClose}/> 
            : null }
        </div>
    )
}

export default HeaderComponent;