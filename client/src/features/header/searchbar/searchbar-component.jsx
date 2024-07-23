import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import getEvents from './get-events';
import getUsers from './get-users';
import { GuestInitializeContext } from '../../guest/guest-initialize-context';
import { GuestContext } from '../../guest/guestid-context';

function SearchbarComponent({searchComplete, setSearchComplete, setDropdown, setOpenNotifications}) {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const { guestInit } = useContext(GuestInitializeContext);
    const { guest } = useContext(GuestContext);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setOpenNotifications(false);
        setDropdown(false);

        if(search === "") {
            setSearchComplete(false);
            return;
        }
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
        navigate(`/user/${id}`);
        setSearchComplete(false);
    }

    const handleEvent = (id) => {
        navigate(`/event/${id}`);
        setSearchComplete(false);
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
                <button className='search-button header-button' type='submit'>Search</button>
            </form>
            { searchComplete ? <div className='search-results dropdown'>
                <h3 className='search-header'>Users</h3>
                {users && users.length === 0 ? <p>No users found</p> :
                        users.map((user) => {
                            return (
                                <div key={user._id}>
                                    <button className="user-nav header-button search-nav" onClick={() => handleUser(user._id)}>{user.username}</button>
                                </div>
                            )
                        })
                }
                <h3 className='search-header'>Events</h3>
                {events && events.length === 0 ? <p>No events found</p> :
                    events.map((event) => {
                        return (
                            <div key={event._id}>
                                <button className="event-nav header-button" onClick={() => handleEvent(event._id)}>{event.event}</button>
                            </div>
                        )
                    })
                }
            </div> : null }
            <br className='temporary-padding'></br>
            { error ? <p className='error'>{error}</p> : null }
        </div>
    )
}

export default SearchbarComponent;