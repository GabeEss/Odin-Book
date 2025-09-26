import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";
import { makeAuthenticatedRequest } from "../features/auth/make-authenticated-request";
import FriendRequestList from "../features/friends/friend-request-list";
import FriendListDisplay from "../features/friends/friend-list-display";
import HeaderComponent from "../features/header/header-component";
import {LoadingDotsContainer, LoadingSpinnerContainer} from '../features/loading/loading-container';

function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [getRequests, setGetRequests] = useState(false);
    const [loadingWheel, setLoadingWheel] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);

    const nav = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoadingWheel(true);
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/user/friends`,
                    {},
                    guest,
                    guestInit
                )
                if(response.data.success) {
                    setFriends(response.data.friends);
                    setFriendRequests(response.data.friendRequests);
                    setLoadingWheel(false);
                } else console.log(response.data.message);
            } catch (error) {
                console.error('error', error);
            }
        }
        fetchFriends();
    }, [getRequests]);

    const handleHome = () => {
        nav('/home');
    }

    if(loadingWheel) return <LoadingSpinnerContainer/>;

  return (
    <div className="friends-page page">
        <HeaderComponent/>
        <div className="friends-list-main">
            <FriendRequestList 
                friendRequests={friendRequests} 
                setGetRequests={setGetRequests} 
                getRequests={getRequests} 
            />
            <FriendListDisplay friends={friends} />
        </div>
    </div>
  );
}

export default FriendsPage;