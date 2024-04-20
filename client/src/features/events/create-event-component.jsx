import { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { makeAuthenticatedRequest } from '../auth/make-authenticated-request';

function CreateEventComponent() {

    const { getAccessTokenSilently } = useAuth0();

    const handleSubmit = (e) => {
        e.preventDefault();
    };


    return(
        <div className='create-event-component'>
            <form className='create-event-form'> onSubmit={handleSubmit}
            <label>
                Event Name:
            </label>
            <input type="text">
            </input>
            </form>
        </div>
    )
}

export default CreateEventComponent;