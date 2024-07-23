import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';
import { GuestContext } from "../guest/guestid-context";
import { GuestInitializeContext } from "../guest/guest-initialize-context";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function UpdateEventComponent({event, setGetEvent, getEvent}) {
    const { guest } = useContext(GuestContext);
    const { guestInit } = useContext(GuestInitializeContext);
    const { getAccessTokenSilently } = useAuth0();

    const [eventName, setEventName] = useState(event.event);
    const [date, setDate] = useState(new Date(event.date).toISOString().split('T')[0]);
    const [time, setTime] = useState(event.time);
    const [location, setLocation] = useState(event.location);
    const [description, setDescription] = useState(event.description);
    const [selectedMembers, setSelectedMembers] = useState(event.members.map(member => member._id));    

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();

    const handleSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedMembers(selectedOptions);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await makeAuthenticatedRequest(
                getAccessTokenSilently,
                'put',
                `${import.meta.env.VITE_API_URL}/event/${id}`,
                {
                    event: eventName,
                    date: date, 
                    time: time,
                    location: location,
                    description: description,
                    members: selectedMembers,
                },
                guest,
                guestInit
            );

            if(response.data.success) {
                console.log('Event updated successfully');
                setModalIsOpen(false);
                setGetEvent(!getEvent);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('error', error);
            setError('Error creating event');
        }
    }

    return(
        <div className="update-event">
            <div className='update-event-component'>
            <button className='update-event-button owner-button' onClick={() => setModalIsOpen(true)}>Update Event</button>
            <Modal
                className='create-event-modal'
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Create Event Modal"
            >
                <form className='create-event-form update-event-form' onSubmit={handleSubmit}>
                    <h2>Update Event</h2>
                    <label>
                        Event Name:
                    </label>
                    <input 
                    type="text"
                    maxLength={25}
                    placeholder={eventName}
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    />
                    <label>
                        Date:
                    </label>
                    <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    <label>
                        Time:
                    </label>
                    <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    />
                    <label>
                        Location:
                    </label>
                    <input
                    type="text" 
                    maxLength={25}
                    placeholder={location}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    />
                    <label>
                        Description:
                    </label>
                    <textarea 
                    maxLength={50}
                    placeholder={description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className='remove-event-members'>
                        <label>
                            Remove Selected Members:
                        </label>
                        <select multiple={true} name="members" value={selectedMembers} onChange={handleSelectChange}>
                            {event.members.map((member) => (
                                <option key={member._id} value={member._id}>{member.username}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">
                        Submit
                    </button>
                    <button onClick={() => setModalIsOpen(false)}>Close</button>
                </form>
                {error && <p>{error}</p>}
            </Modal>
        </div>
        </div>
    )
}

export default UpdateEventComponent;