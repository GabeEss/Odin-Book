import { GuestContext } from './guestid-context';
import { GuestInitializeContext } from './guest-initialize-context';
import {guestLogin} from './guest-login';
import { useAuth0 } from '@auth0/auth0-react';
import {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';

function GuestLoginComponent({setLoadingWheel}) {
    const nav = useNavigate();
    const {guest, setGuest} = useContext(GuestContext);
    const {setGuestInit} = useContext(GuestInitializeContext);
    const [username, setUsername] = useState('');
    const [displayInputField, setDisplayInputField] = useState(false);

    const {
        isAuthenticated,
        getAccessTokenSilently,
    } = useAuth0();

    const handleGuestClick = () => {
        setDisplayInputField(true);
    };

    const handleGuestLogin = async (e) => {
        e.preventDefault();
        setLoadingWheel(true);
        try {
            const response = await guestLogin({guest, getAccessTokenSilently, isAuthenticated, username});
            // Initialize guest user
            if(response.data.success === true) {
                setGuestInit(true);
                setGuest(response.data.guestId);
                if(response.data.firstTimeLogin === true) {
                    nav('/signup');
                } else { 
                    nav('/home');
                }
            } else console.log(response.data.message);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingWheel(false);
        }
    }

return (
        <div className='create-guest'>
            {
                displayInputField ? 
                <div> 
                <textarea 
                    className='textarea-guest-login'
                    rows="4"
                    cols="50"
                    maxLength={100}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a Name"/>
                <button
                    className='create-guest-button'
                    onClick={handleGuestLogin}
                >
                    Login GUEST PLS
                </button>
                </div>
                : <button className='create-guest-button' onClick={handleGuestClick}>Enter as Guest User</button>
            }
        </div>
    )
}

export default GuestLoginComponent;