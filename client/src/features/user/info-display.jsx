import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { GuestInitializeContext } from "../guest/guest-initialize-context";
import { GuestContext } from "../guest/guestid-context";
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";

// eslint-disable-next-line react/prop-types
function InfoDisplay({setShowSignupPrompt}) {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const {guest} = useContext(GuestContext);
    const {guestInit} = useContext(GuestInitializeContext);

    const [userName, setUserName] = useState('');
    const [worksAt, setWorksAt] = useState('');
    const [livesIn, setLivesIn] = useState('');
    const [userFrom, setUserFrom] = useState('');
    const [error, setError] = useState(null);

    const [showSignupOnce, setShowSignupOnce] = useState(false); // only show signup prompt once
    
    const getUserInfo = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'get',
                `${import.meta.env.VITE_API_URL}/user`,
                {},
                guest,
                guestInit
            )
            if(response.data.success) {
                if(response.data.signupPrompt && !showSignupOnce) {
                    console.log('signup prompt');
                    setShowSignupPrompt(true);
                    setShowSignupOnce(true);
                }
                setUserName(response.data.username);
                setWorksAt(response.data.worksAt);
                setLivesIn(response.data.livesIn);
                setUserFrom(response.data.from);
            } else {
                throw new Error('Failed to retrieve user info');
            }
        } catch (error) {
            console.error('error', error);
            setError('Failed to retrieve user info, please contact support');
        }
    }

    useEffect(() => {
        if(isAuthenticated || guestInit) {
            getUserInfo();
        }
    }), [isAuthenticated, guestInit];

    return (
        <div>
            {error ? <p>{error}</p> : null}
            <h2>{userName}</h2>
            <p>Works at: {worksAt}</p>
            <p>Lives in: {livesIn}</p>
            <p>From: {userFrom}</p>
        </div>
    );
}

export default InfoDisplay;