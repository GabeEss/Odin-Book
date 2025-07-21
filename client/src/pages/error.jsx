import { useAuth0 } from '@auth0/auth0-react';
import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestInitializeContext } from '../features/guest/guest-initialize-context';
import { UserContext } from '../features/user/context/user-context';
import { SocketContext } from '../features/sockets/socket-context';

function ErrorPage() {
    const { logout, isAuthenticated } = useAuth0();
    const nav = useNavigate();
    const {currentUser} = useContext(UserContext);
    const {setGuestInit} = useContext(GuestInitializeContext);
    const {socket} = useContext(SocketContext);

    const handleLogout = () => {
        if(currentUser) socket.emit('userLeft', currentUser.userId);
        logout({ returnTo: window.location.origin });
    }

    const sendToLogin = () => {
        if(currentUser) socket.emit('userLeft', currentUser.userId);
        setGuestInit(false);
        nav('/');
        // Clear the guestId cookie, which is set in the backend
        Cookies.remove('guestId');
    }

    return (
        <div className='error-page'>
            <h1 className='error-heading'>Error</h1>
            {isAuthenticated ? 
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                : <button onClick={sendToLogin}>
                    To the Login Page
                    </button>
            }
        </div>
    )
}

export default ErrorPage;