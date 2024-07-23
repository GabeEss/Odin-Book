import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CreateEventComponent() {
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const { getAccessTokenSilently } = useAuth0();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'post',
                `${import.meta.env.VITE_API_URL}/event`,
                {
                    event: e.target[0].value,
                    date: e.target[1].value,
                    time: e.target[2].value,
                    location: e.target[3].value,
                    description: e.target[4].value
                },
                guest,
                guestInit
            );

            if(response.data.success) {
                console.log('Event created');
                setModalIsOpen(false);
                nav(`/event/${response.data.event._id}`);
            } else console.log(response.data.message);
        } catch (error) {
            console.error('error', error);
            setError('Error creating event');
        }
    };

    const handleCancel = () => {
        setModalIsOpen(false);
    }

    return(
        <div className='create-event-component'>
            <button className='create-event-button' onClick={() => setModalIsOpen(true)}>Create Event</button>
            <Modal
                className='create-event-modal'
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Create Event Modal"
            >
                <form className='create-event-form' onSubmit={handleSubmit}>
                    <h2>Create New Event</h2>
                    <label>
                        Event Name:
                    </label>
                    <input
                    maxLength={25}
                    type="text" />
                    <label>
                        Date:
                    </label>
                    <input type="date" />
                    <label>
                        Time:
                    </label>
                    <input type="time" />
                    <label>
                        Location:
                    </label>
                    <input 
                    maxLength={25}
                    type="text" />
                    <label>
                        Description:
                    </label>
                    <textarea
                    maxLength={50}/>
                    <button type="submit">
                        Submit
                    </button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
                {error && <p>{error}</p>}
            </Modal>
        </div>
    )
}

export default CreateEventComponent;