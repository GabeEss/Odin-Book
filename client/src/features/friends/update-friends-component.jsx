import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function UpdateFriendsComponent() {
    const { 
        getAccessTokenSilently,
        isAuthenticated,
     } = useAuth0();

    const {guestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);

    return(
        <div className='update-friends-component'>
            
        </div>
    )
}

export default UpdateFriendsComponent;