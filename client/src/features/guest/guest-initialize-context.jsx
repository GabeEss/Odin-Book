import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Create a context to initialize the guest

export const GuestInitializeContext = createContext();

export const GuestInitializeProvider = ({ children }) => {
    const [guestInit, setGuestInit] = useState(false);

    return (
        <GuestInitializeContext.Provider value={{ guestInit, setGuestInit }}>
            {children}
        </GuestInitializeContext.Provider>
    );
};

GuestInitializeProvider.propTypes = {
    children: PropTypes.node,
};