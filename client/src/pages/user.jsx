import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";

import getUserProfile from "../features/user/get-user-profile";
import InfoDisplay from '../features/user/info-display';
import ProfileDisplay from '../features/user/profile-display';
import CoverDisplay from '../features/user/cover-display';

function UserPage() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const { id } = useParams();
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);
    const [user, setUser] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleHome = () => {
        if(isAuthenticated || guestInit) {
            navigate('/home');
        }
    }

    useEffect(() => {
        try {
            setLoading(true);
            const fetchUserInfo = async () => {
                if(isAuthenticated || guestInit) {
                    const userInfo = await getUserProfile(
                        id,
                        getAccessTokenSilently,
                        guest,
                        guestInit
                    );
                    if(userInfo.success) {
                        setUser(userInfo);
                    }
                }
            }
            fetchUserInfo();
            setLoading(false);
        } catch (error) {
            console.error('error', error);
            setError('Failed to fetch user information');
            setLoading(false);
        }
    }, []);

    if(loading) {
        return(
            <div className='user-page page'>
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <div className='user-page page'>
            {error ? <p>{error}</p> : null}
            <div className='profile-header'>
                <div className='cover-background'>
                    <CoverDisplay user={user}/>
                </div>
                <div className='cover-foreground'>
                    <ProfileDisplay user={user}/>
                    <div className ="user-buttons">
                        <button>Send message</button>
                        <button>Send friend request</button>
                        <button>Options</button>
                        <button onClick={handleHome}>Home</button>
                    </div>
                </div>
            </div>
            <div className='sidebar'>
                <InfoDisplay user={user}/>
            </div>
            <div className='main-content'>
                <div className='posts'>
                    <p>Posts go here.</p>
                </div>
            </div>
        </div>
    )
}

export default UserPage;