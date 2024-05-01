import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../features/auth/make-authenticated-request';
import { GuestInitializeContext } from "../features/guest/guest-initialize-context";
import { GuestContext } from "../features/guest/guestid-context";

import CreateEventComponent from '../features/events/create-event-component';
import EventListDisplay from '../features/events/event-list-display';

function EventsPage() {
    const { getAccessTokenSilently } = useAuth0();
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await makeAuthenticatedRequest(
                    getAccessTokenSilently,
                    'get',
                    `${import.meta.env.VITE_API_URL}/events/all`,
                    {},
                    guest,
                    guestInit
                )
                if(response.data.success) {
                    setEvents(response.data.events);
                    setLoading(false);
                }
            } catch (error) {
                console.error('error', error);
            }
        }
        fetchEvents();
    }, []);

    const handleHome = () => {
        nav('/home');
    }

    return(
        <div className='events-page page'>
            <h1>Events Page</h1>
            <button className='home-button' onClick={handleHome}>Home</button>
            <CreateEventComponent/>
            {loading ? <p className="loading">Loading...</p> : events.length > 0 ? 
                <EventListDisplay events={events}/> :
                <p>No events to display</p>
            }
        </div>
    )
}

export default EventsPage;