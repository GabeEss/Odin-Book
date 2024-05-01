import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

function JoinEventComponent({setGetEvent, getEvent}) {
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const { getAccessTokenSilently } = useAuth0();
    const { id } = useParams();

    const handleJoin = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/event/${id}/join`,
                {},
                guest,
                guestInit
            );

            if(response.data.success) {
                console.log('Event joined successfully');
                setGetEvent(!getEvent);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('error', error);
        }
    }
    return(
        <div className="update-event-membership">
            <button onClick={handleJoin}>Join Event</button>
        </div>
    )
}

export default JoinEventComponent;