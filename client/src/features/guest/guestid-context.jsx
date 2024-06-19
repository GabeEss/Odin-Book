import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Context to hold the guest id and store in local storage

export const GuestContext = createContext();

export const GuestProvider = ({ children }) => {
    const [guest, setGuest] = useState(() => {
        const storedGuest = localStorage.getItem('guest');
        return storedGuest && storedGuest !== "undefined" ? JSON.parse(storedGuest) : "";
    });

    useEffect(() => {
        localStorage.setItem('guest', JSON.stringify(guest));
    }, [guest]);

    return (
        <GuestContext.Provider value={{ guest, setGuest }}>
            {children}
        </GuestContext.Provider>
    );
};

GuestProvider.propTypes = {
    children: PropTypes.node,
};

