import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

function DeleteEventComponent() {
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const { getAccessTokenSilently } = useAuth0();
    const { id } = useParams();
    const nav = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'delete',
                `${import.meta.env.VITE_API_URL}/event/${id}`,
                {},
                guest,
                guestInit
            );

            if(response.data.success) {
                console.log('Event deleted successfully');
                nav('/home');
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('error', error);
        }
    }

    return(
        <div className="delete-event">
            <button onClick={handleDelete}>Delete Event</button>
        </div>
    )
}

export default DeleteEventComponent;