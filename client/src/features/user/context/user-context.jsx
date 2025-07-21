import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useState, useEffect } from 'react';
import { GuestContext } from "../../guest/guestid-context";
import { GuestInitializeContext } from "../../guest/guest-initialize-context";
import { SocketContext } from "../../sockets/socket-context";
import { handleGetUser } from "./get-current-user";

// This context provides and manages the current authenticated or guest user state

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const {
        getAccessTokenSilently,
        user
    } = useAuth0();
    const {guest} = useContext(GuestContext);
    const {guestInit} = useContext(GuestInitializeContext);    
    const [currentUser, setCurrentUser] = useState("");
    const {socket} = useContext(SocketContext);

    // Get and set current user, then emit userJoined socket event for caching
    useEffect(() => {
        const fetchUser = async () => {
            await handleGetUser(getAccessTokenSilently, guest, guestInit, setCurrentUser);
        }
        fetchUser();
    },[guestInit, user]);

    useEffect(() => {
        if(guestInit || user) {
            socket.emit('userJoined', currentUser.userId);
        }
    }, [currentUser]);

    return(
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </UserContext.Provider>
    )
}