import { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from "../auth/make-authenticated-request";
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

function RemoveFriendComponent({ id, setFriendChange, friendChange }) {
    const { getAccessTokenSilently } = useAuth0();
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);

    const removeFriend = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/user/remove`,
                { id },
                guest,
                guestInit
            )
            if (response.data.success) {
                setFriendChange(!friendChange);
                console.log("Friend removed.");
            } else console.log(response.data.message);
        } catch (error) {
            console.error('error', error);
        }
    }

  return (
    <div>
      <button onClick={() => removeFriend()}>Remove</button>
    </div>
  );
}

export default RemoveFriendComponent;