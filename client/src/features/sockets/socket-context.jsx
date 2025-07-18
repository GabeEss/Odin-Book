import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

// This context will initialize and provide a single Socket.IO connection for the user

export const SocketContext = createContext();

export const SocketProvider = ({children}) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(`${import.meta.env.VITE_API_URL}`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return(
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}