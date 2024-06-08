// Needs a socket chatroom to listen for notifications
// Send a notification for when the user has a post on their page
// A notification for when the user has a post on an event they are apart of
// A notification for a received friend request
import io from 'socket.io-client';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { handleGetUser } from './get-current-user';
import SearchbarComponent from "./searchbar/searchbar-component";

const socket = io(`${import.meta.env.VITE_API_URL}`);

function HeaderComponent() {
    const {
        logout,
        isAuthenticated,
        getAccessTokenSilently,
        user
    } = useAuth0();
    const {guestInit, setGuestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const location = useLocation();
    const nav = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // mongo user
    const [authUser, setAuthUser] = useState(null); // guest or auth user
    const [hasNotification, setHasNotification] = useState(false);

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
            setHasNotification(true);
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
        }
    }

    // Initializes current user
    useEffect(() => {
        if(guestInit) setAuthUser(guest);
        else setAuthUser(user.sub);
    }, [user.sub]);

    const handleNotificationClick = () => {
        setHasNotification(false);
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


    return(
        <div className="header">
            <SearchbarComponent/>
            <div className="header-dropdown">
                {currentUser ? <button className="user-nav" onClick={handleUser}>User Page</button> : null}
                <button className="friends-nav" onClick={handleFriends}>Friends</button>
                <button className="events-nav" onClick={handleEvents}>Events</button>
                <button className="home-nav" onClick={handleHome}>Home</button>
                {hasNotification ? 
                <button className="notifications-nav has-notification" onClick={handleNotificationClick}>Notifications</button> : 
                <button className="notifications-nav" onClick={handleNotificationClick}>Notifications</button>
                }
                <div className="dropdown-content">
                    <button className='logout-nav' onClick={handleLogout}>
                        Log out
                    </button>
                    <button className='signup-nav' onClick={() => nav('/signup')}>Update User</button>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent;