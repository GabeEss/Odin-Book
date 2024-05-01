import EventListItem from './event-list-item';
import { useNavigate } from 'react-router-dom';

function EventListDisplay({ events }) {
    const nav = useNavigate();

    const handleClick = (event) => {
        nav(`/event/${event._id}`);
    }

  return (
    <div className='event-list'>
      {events.map((event) => (
        <EventListItem key={event._id} event={event} onClick={() => handleClick(event)}/>
      ))}
    </div>
  );
}

export default EventListDisplay;