import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../auth/makeAuthRequest';
import { useAuth0 } from '@auth0/auth0-react';

function LoginComponent () {
    const [error, setError] = useState(null);

    const {
        loginWithPopup,
        isAuthenticated,
        getAccessTokenSilently,
    } = useAuth0();

    const navigate = useNavigate();    

    const handleLogin = () => {
            loginWithPopup().then(async () => {
                try {
                    const response = await makeAuthenticatedRequest(
                        getAccessTokenSilently,
                        'post',
                        `${import.meta.env.VITE_API_URL}/user/register`,
                        {}
                    );
                    if(response.data.firstTimeLogin === true && response.data.success === true) {
                        navigate('/signup');
                    } else if (response.data.success === true) {
                        navigate('/home');
                    } else {
                        setError(error.response.data.message);
                    }
                } catch (error) {
                    console.error('error', error);
                }
                
            });
        
    }

    const handleSignUp = () => {
        if(!isAuthenticated)
            navigate('/signup');
    }

    return (
        <div className='login-component section'>
            <button className='login-button' onClick={handleLogin}>Log in</button>
            <button className='forgot-password-button'>Forgot Password?</button>
            <button
            className='new-account-button'
            onClick={handleSignUp}>
                    Create New Account
            </button>
            <p className="error-message">{error}</p>
        </div>
    )
}

export default LoginComponent;