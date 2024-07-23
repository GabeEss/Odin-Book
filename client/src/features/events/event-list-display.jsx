import EventListItem from './event-list-item';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EventListDisplay({ events }) {
    const nav = useNavigate();

    const [sortedEvents, setEvents] = useState(events);

    const handleClick = (event) => {
        nav(`/event/${event._id}`);
    }

    const handleAscending = () => {
        setEvents([...events].sort((a, b) => new Date(a.date) - new Date(b.date)));
    }

    const handleDescending = () => {
        setEvents([...events].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }

  return (
    <div className='event-list'>
        <div className="sorting-buttons">
            <button className='sorting-latest' onClick={handleDescending}>Latest</button>
            <button onClick={handleAscending}>Oldest</button>
        </div>
        <div className='sorting-and-events-linebreak'></div>
      <div className='events-arr'>
      {sortedEvents.map((event) => (
        <EventListItem key={event._id} event={event} onClick={() => handleClick(event)}/>
      ))}
      </div>
    </div>
  );
}

export default EventListDisplay;