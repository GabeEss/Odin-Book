import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestInitializeContext } from '../guest/guest-initialize-context';
import { GuestContext } from '../guest/guestid-context';

function FriendRequestList({friendRequests, setGetRequests, getRequests}) {
    const { getAccessTokenSilently } = useAuth0();
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);

    return(
        <div className="friend-request-list">
            {friendRequests && friendRequests.length === 0 ? null
            : <div>
                <h2>Friend Requests</h2>
                {friendRequests.map((request) => {
                    return (
                        <div key={request._id}>
                            {/* {request.displayColor} */}
                            {request.username}
                        </div>
                    )
                })}
                </div>
            }
        </div>
    )
}

export default FriendRequestList;