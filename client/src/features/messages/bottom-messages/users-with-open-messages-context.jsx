import { createContext, useState } from 'react';

// Context to hold a list of user objects with whom the current user has open messages
export const UsersWithOpenMessagesContext = createContext();

export const UsersWithOpenMessagesProvider = ({ children }) => {
    const [openUsers, setOpenUsers] = useState([]);

    return (
        <UsersWithOpenMessagesProvider.Provider value={{ openUsers, setOpenUsers }}>
            {children}
        </UsersWithOpenMessagesProvider.Provider>
    );
};