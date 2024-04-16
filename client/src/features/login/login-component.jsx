import { useState, useContext } from 'react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestInitializeContext } from '../guest/guest-initialize-context';

// eslint-disable-next-line react/prop-types
function LoginComponent () {
    const [error, setError] = useState(null);
    const {setGuestInit} = useContext(GuestInitializeContext);

    const {
        loginWithPopup,
        getAccessTokenSilently,
        logout
    } = useAuth0();

    const handleLogin = async () => {
            loginWithPopup().then(async () => {
                try {
                    setGuestInit(false);
                    const response = await makeAuthenticatedRequest(
                        getAccessTokenSilently,
                        'post',
                        `${import.meta.env.VITE_API_URL}/user/register`,
                        {},
                        '',
                        false
                    )
                    if(response.data.success) {
                        console.log(response.data.message);
                    } else {
                        console.log("Login failed.");
                        setError('Login failed');
                        handleLogout();
                    }
                } catch (error) {
                    console.error('error', error);
                }
            });
    }

    const handleLogout = () => {
        logout({ returnTo: window.location.origin })
    };

    return (
        <div className='login-component section'>
            <button className='login-button' onClick={handleLogin}>Log in</button>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default LoginComponent;