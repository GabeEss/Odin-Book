import { useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import getEvents from './get-events';
import getUsers from './get-users';
import { GuestInitializeContext } from '../guest/guest-initialize-context';
import { GuestContext } from '../guest/guestid-context';

function SearchbarComponent() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchComplete, setSearchComplete] = useState(false);
    const [error, setError] = useState('');
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);
    const { getAccessTokenSilently } = useAuth0();

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchComplete(false);
        try {
            const users = await getUsers(search, getAccessTokenSilently, guest, guestInit);
            const events = await getEvents(search, getAccessTokenSilently, guest, guestInit);

            setUsers(users);
            setEvents(events);
        } catch (error) {
            console.error('error', error);
            setError('Failed to search');
        } finally {
            setSearchComplete(true);
            setSearch('');
        }
    }

    const handleUser = (id) => {
        console.log('User:', id);
    }

    const handleEvent = (id) => {
        console.log('Event:', id);
    }

    return(
        <div className='searchbar-component'>
            <form onSubmit={handleSearch}>
                <input 
                type='text' 
                placeholder='Search' 
                className='searchbar' 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}/>
                <button className='search-button' type='submit'>Search</button>
            </form>
            { searchComplete ? <div className='search-results'>
                <h2>Users</h2>
                {users && users.length === 0 ? <p>No users found</p> :
                        users.map((user) => {
                            return (
                                <div key={user._id}>
                                    <button className="user-nav" onClick={() => handleUser(user._id)}>{user.username}</button>
                                </div>
                            )
                        })
                }
                <h2>Events</h2>
                {events && events.length === 0 ? <p>No events found</p> :
                    events.map((event) => {
                        return (
                            <div key={event._id}>
                                <button className="event-nav" onClick={() => handleEvent(event._id)}>{event.name}</button>
                            </div>
                        )
                    })
                }
            </div> : null }
            { error ? <p className='error'>{error}</p> : null }
        </div>
    )
}

export default SearchbarComponent;