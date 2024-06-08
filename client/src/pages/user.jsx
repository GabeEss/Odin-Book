import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";

import HeaderComponent from "../features/header/header-component";
import getUserProfile from "../features/user/get-user-profile";
import InfoDisplay from '../features/user/info-display';
import ProfileDisplay from '../features/user/profile-display';
import CoverDisplay from '../features/user/cover-display';
import UserOptions from '../features/user/user-options-component';
import PostListDisplay from '../features/posts/post-list-display';

function UserPage() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const { id } = useParams();
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);
    const [user, setUser] = useState('');
    const [self, setSelf] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendChange, setFriendChange] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

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
                        setSelf(userInfo.self);
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
    }, [friendChange, location]);

    if(loading) {
        return(
            <div className='user-page page'>
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <div className='user-page page'>
            <HeaderComponent/>
            {self ? <p>This is your profile</p> : null}
            {error ? <p>{error}</p> : null}
            <div className='profile-header'>
                <div className='cover-background'>
                    <CoverDisplay user={user}/>
                </div>
                <div className='cover-foreground'>
                    <ProfileDisplay user={user}/>
                    <div className ="user-buttons">
                        {self ? <button>Current User Options Go Here</button> :
                         <UserOptions 
                            id={id} 
                            sentRequest={user.sentRequest} 
                            receivedRequest={user.receivedRequest} 
                            isFriend={user.isFriend}
                            setFriendChange={setFriendChange}
                            friendChange={friendChange}
                        />}
                        <button onClick={handleHome}>Home</button>
                    </div>
                </div>
            </div>
            <div className='sidebar'>
                <InfoDisplay user={user}/>
            </div>
            <div className='main-content'>
                <PostListDisplay location={location}/>
            </div>
        </div>
    )
}

export default UserPage;