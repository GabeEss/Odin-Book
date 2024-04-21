import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginComponent from '../features/login/login-component';
import CreateGuestComponent from '../features/guest/create-guest-component';
import { GuestInitializeContext } from '../features/guest/guest-initialize-context';
import { GuestContext } from '../features/guest/guestid-context';
import { makeAuthenticatedRequest } from '../features/auth/make-authenticated-request';

function LoginPage() {
    const {
        logout,
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();
    // const [loading, setLoading] = useState(false);
    const {guestInit, setGuestInit} = useContext(GuestInitializeContext);
    const {guest} = useContext(GuestContext);
    const [sendToSignup, setSendToSignup] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const navigate = useNavigate();

    const handleHome = () => {
        if(isAuthenticated || guestInit)
            navigate('/home');
    }

    // Check if user is registered once they log in with auth0
    useEffect(() => {
        if(isAuthenticated || guestInit) {
            const checkRegistration = async () => {
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
                    if(response.data.worksAt === '' || response.data.livesIn === '' || response.data.from === '') {
                        setSendToSignup(true);
                    } else setIsRegistered(true);
                } else { 
                    logout({ returnTo: window.location.origin });
                }
            } catch (error) {
                console.error('error', error);
            }
        }
        checkRegistration();
    }
}, [isAuthenticated, guestInit]);

    // If user is authenticated and registered, navigate to home page
    // If the user needs information updated, navigate to signup page
    useEffect(() => {
        if(isAuthenticated && isRegistered) {
            setGuestInit(false);
            navigate('/home');
        } else if(isAuthenticated && sendToSignup) {
            setGuestInit(false);
            navigate('/signup');
        }
    }, [isAuthenticated, isRegistered, sendToSignup]);

    // if(loading) return <div>Loading...</div>;

    return(
        <div className='login-page page'>
            <h1 className='login-heading'>Welcome to Name Book</h1>
            {!isAuthenticated ? 
                <div className='login-section section'>
                    <LoginComponent isRegistered={isRegistered} setIsRegistered={setIsRegistered}/>
                    <CreateGuestComponent/>
                </div>
            : 
                <div className='welcome-section section'>
                    <button className='home-button' onClick={handleHome}>Home</button>
                    <button className='logout-button' onClick={() => logout({ returnTo: window.location.origin })}>
                    Log out
                    </button>
                </div>
            }            
        </div>
    )
}

export default LoginPage;