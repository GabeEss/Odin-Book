import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GuestContext } from './guestid-context';
import { GuestInitializeContext } from './guest-initialize-context';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

function CreateGuestComponent({setLoadingWheel}) {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const nav = useNavigate();
    const {guest, setGuest} = useContext(GuestContext);
    const {setGuestInit} = useContext(GuestInitializeContext);

    const handleGuest = async () => {
        if(!isAuthenticated) {
            setLoadingWheel(true);
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'post',
                    `${import.meta.env.VITE_API_URL}/user/guest/register`,
                    {},
                    guest,
                    true
                );

                // Initialize guest user and store guest id for future logins from same computer
                if(response.data.success === true) {
                    setGuestInit(true);
                    setGuest(response.data.guestId);
                    if(response.data.firstTimeLogin === true) {
                        nav('/signup');
                    } else nav('/home');
                } else console.log(response.data.message);
            } catch(error) {
                console.error('error', error);
            } finally { setLoadingWheel(false); }
        }
    }

    return (
        <div className='create-guest'>
            <button className='create-guest-button' onClick={handleGuest}>Enter as Guest User</button>
        </div>
    )
}

export default CreateGuestComponent;