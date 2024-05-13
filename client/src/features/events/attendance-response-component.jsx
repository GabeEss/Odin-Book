import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";

function AttendanceResponeComponent({event, setGetEvent, getEvent}) {
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const { getAccessTokenSilently } = useAuth0();
    const { id } = useParams();

    const handleResponse = async (attendanceResponse) => {
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/event/${id}/respond`,
                { attendanceResponse },
                guest,
                guestInit
            )
            if(response) {
                setGetEvent(!getEvent);
            } else console.log('Error responding to event', response.data.message);
        } catch (error) {
            console.error('error', error);
        }   
    }

    return(
        <div className='attendance-response-container'>
            <h1>Attendance Response</h1>
            <p>Are you attending this event?</p>
            <div className='response-buttons'>
                <button onClick={() => handleResponse('going')}>Yes</button>
                <button onClick={() => handleResponse('notGoing')}>No</button>
                <button onClick={() => handleResponse('maybe')}>Maybe</button>
            </div>
        </div>
    )
}

export default AttendanceResponeComponent;