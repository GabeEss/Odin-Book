import io from 'socket.io-client';
import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

const socket = io(`${import.meta.env.VITE_API_URL}`);

// Send friend request to user (._id)
function SendFriendRequest({id, setFriendChange, friendChange}) {
    const { getAccessTokenSilently } = useAuth0();
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);

    const handleFriendRequest = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/friends/request`,
                {id},
                guest,
                guestInit
            )
            if(response.data.success) {
                setFriendChange(!friendChange);
                socket.emit('sendFriendRequestNotification', response.data);
                console.log("Friend request sent. Notifaction sent to user.");
            } else {
                console.log("Friend request failed.");
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('error', error);
        }
    }

    return(
        <div>
            <button onClick={handleFriendRequest}>Send friend request</button>
        </div>
    )
}

export default SendFriendRequest;