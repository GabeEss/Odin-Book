import { createContext, useState, useEffect, useContext } from 'react';
import { makeAuthenticatedRequest } from '../../auth/make-authenticated-request';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestContext } from "../../guest/guestid-context";
import { GuestInitializeContext } from "../../guest/guest-initialize-context";

// Context to hold the notification status between pages

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(false);
    const {getAccessTokenSilently} = useAuth0();
    const {guest} = useContext(GuestContext);
    const {guestInit} = useContext(GuestInitializeContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/notifications`,
                {},
                guest,
                guestInit
            );

            if(response.data.success) {
                const unreadNotifications = response.data.notifications.some(notification => !notification.read);
                setNotifications(unreadNotifications);
            }
        }
        fetchNotifications();
    }, []);

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};