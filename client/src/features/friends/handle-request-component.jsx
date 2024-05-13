import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

function HandleRequestComponent({ id, setFriendChange, friendChange }) {
    const { getAccessTokenSilently } = useAuth0();
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);

    const acceptRequest = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/friends/accept`,
                { id },
                guest,
                guestInit
            )
            if (response.data.success) {
                setFriendChange(!friendChange);
                console.log("Friend request accepted.");
            } else console.log(response.data.message);
        } catch (error) {
            console.error('error', error);
        }
    }

    const rejectRequest = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/friends/reject`,
                { id },
                guest,
                guestInit
            )
            if (response.data.success) {
                setFriendChange(!friendChange);
                console.log("Friend request rejected.");
            }
        } catch (error) {
            console.error('error', error);
        }
    }

  return (
    <div>
      <button onClick={() => acceptRequest()}>Accept</button>
      <button onClick={() => rejectRequest()}>Reject</button>
    </div>
  );
}

export default HandleRequestComponent;