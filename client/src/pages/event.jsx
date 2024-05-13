import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../features/auth/make-authenticated-request';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";

import EventDisplay from '../features/events/event-display';
import CreateEventComponent from '../features/events/create-event-component';

function EventPage() {
    const { getAccessTokenSilently } = useAuth0();
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const [event, setEvent] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getEvent, setGetEvent] = useState(false);
    const { id } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/event/${id}`,
                    {},
                    guest,
                    guestInit
                )
                if(response.data.success) {
                    setEvent(response.data.event);
                    setIsOwner(response.data.isOwner);
                    setIsMember(response.data.isMember);
                    setLoading(false);
                } else console.log(response.data.message);
            } catch (error) {
                console.error('error', error);
            }
        }
        fetchEvent();
    }, [getEvent]);

    return(
        <div className="event-page page">
            <h1>Event Page</h1>
            <button className='home-button' onClick={() => nav('/home')}>Home</button>
            <CreateEventComponent/>
            {loading ? <p className='loading'>Loading...</p> :
                <EventDisplay
                    event={event} 
                    isOwner={isOwner} 
                    isMember={isMember} 
                    setGetEvent={setGetEvent}
                    getEvent={getEvent}
                />
            }
        </div>
    )
}

export default EventPage;