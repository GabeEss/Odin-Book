import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
import CurrentUserOptions from '../features/user/current-user-options-component';

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

    const location = useLocation();

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
            // setError('Failed to fetch user information');
            setLoading(false);
        }
    }, [friendChange, location]);

    if(loading) {
        return <div className="spinner"></div>
    }

    return(
        <div className='user-page page'>
            <HeaderComponent/>
            <div className='profile-header'>
                    <CoverDisplay user={user}/>
                    <div className='cover-foreground'>
                        <ProfileDisplay user={user} self={self}/>
                        <div className ="user-buttons">
                            {self ? <CurrentUserOptions/> :
                            <UserOptions 
                                id={id} 
                                sentRequest={user.sentRequest} 
                                receivedRequest={user.receivedRequest} 
                                isFriend={user.isFriend}
                                setFriendChange={setFriendChange}
                                friendChange={friendChange}
                            />}
                        </div>
                    </div>
            </div>
            <div className='main-and-sidebar'>
                <div className='sidebar'>
                    <InfoDisplay user={user}/>
                </div>
                <div className='main-content'>
                    <PostListDisplay location={location}/>
                </div>
            </div>
        </div>
    )
}

export default UserPage;