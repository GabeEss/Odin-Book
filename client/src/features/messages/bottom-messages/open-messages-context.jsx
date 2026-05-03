import { createContext, useState, useEffect, useContext } from 'react';

// Context to hold multiple open message instances
export const OpenMessagesContext = createContext();

export const OpenMessagesProvider = ({ children }) => {
    const [openMessages, setOpenMessages] = useState([]);

    return (
        <OpenMessagesProvider.Provider value={{ openMessages, setOpenMessages }}>
            {children}
        </OpenMessagesProvider.Provider>
    );
};