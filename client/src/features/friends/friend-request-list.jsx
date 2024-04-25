import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestInitializeContext } from '../guest/guest-initialize-context';
import { GuestContext } from '../guest/guestid-context';

function FriendRequestList({friendRequests, setGetRequests, getRequests}) {
    const { getAccessTokenSilently } = useAuth0();
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);

    const acceptRequest = async (requestId) => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/friends/accept`,
                {requestId},
                guest,
                guestInit
            )
            if(response.data.success) {
                setGetRequests(!getRequests);
                console.log("Friend request accepted.");
            }
        } catch (error) {
            console.error('error', error);
        }
    }

    const rejectRequest = async (requestId) => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/friends/reject`,
                {requestId},
                guest,
                guestInit
            )
            if(response.data.success) {
                setGetRequests(!getRequests);
                console.log("Friend request rejected.");
            }
        } catch (error) {
            console.error('error', error);
        }   
    }


    return(
        <div className="friend-request-list">
            <h2>Friend Requests</h2>
            {friendRequests && friendRequests.length === 0 ? <p>No friendRequests found</p>
            :
                friendRequests.map((request) => {
                    return (
                        <div key={request._id}>
                            <p>{request.username} wants to be your friend.</p>
                            <div className='request-buttons'>
                                <button 
                                className="request-button" 
                                onClick={() => acceptRequest(request._id)}>
                                    Accept
                                </button>
                                <button
                                className='request-button'
                                onClick={() => rejectRequest(request._id)}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default FriendRequestList;