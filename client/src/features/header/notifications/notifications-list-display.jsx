import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './use-notifications-hook';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestInitializeContext } from "../../guest/guest-initialize-context";
import { GuestContext } from "../../guest/guestid-context";


function NotificationsList({setOpenNotifications, setIsOpen, setModalUser}) {
    const {
        getAccessTokenSilently,
    } = useAuth0();
    const {guest} = useContext(GuestContext);
    const {guestInit} = useContext(GuestInitializeContext);
    const [rendering, setIsRendering] = useState(false);
    const [numItems, setNumItems] = useState(5);
    const nav = useNavigate();
    const { data, error, isLoading, refetch } = useNotifications(getAccessTokenSilently, guest, guestInit);
    const [notifications, setNotifications] = useState([]);

    // Handle scrolling down to render more posts
    const handleScroll = (e) => {
        const {scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight && !rendering && numItems < notifications.length) {
          setIsRendering(true);
          setTimeout(() => {
              setNumItems(prevNumItems => prevNumItems + 5);
              setIsRendering(false);
          }, 1000);
      }
    };

    // Fetches previous notifications
    useEffect(() => {
        if(data) {
          const sortedNotifications = [...data.notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setNotifications(sortedNotifications);
        }
    }, [data]);

    // Refetch notifications on location change
    useEffect(() => {
      refetch();
    }, [location])

    const handleNotificationClick = (notification) => {
        setOpenNotifications(false);
        if(notification.type === "newMessage") {
            if(location.pathname !== `/messages/${notification.triggeredBy._id}`) {
                setModalUser(notification.triggeredBy);
                setIsOpen(true);
            }
        } else if (notification.type === "newPost") {
            nav(`/user/${notification.user}`);
        } else if (notification.type === 'friendRequest') {
            nav(`/friends`);
        }
    }

    return(
        <div className="notifications-list dropdown" onScroll={handleScroll}>
            {isLoading ? <div>Loading...</div> : error ? <div>Error fetching notificatins</div> :
            notifications.slice(0, numItems).map((notification, index) =>
                <div 
                    key={index}
                    className='notification'
                    role='button'
                    tabIndex="0"
                    onClick={() => handleNotificationClick(notification)}
                >
                        {notification.read ? 
                            <div className='notification-container read'>
                                <p>{notification.notification}</p>
                                <p>{new Date(notification.timestamp).toLocaleString()}</p>
                            </div> : 
                            <div className='notification-container notread'>
                                <p>{notification.notification}</p>
                                <p>{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>}
                </div>
            )}
        </div>
    )
}

export default NotificationsList;