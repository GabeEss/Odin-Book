// Displays the event on the events page

function EventListItem({ event, onClick}) {
    return (
      <div className='event-item' onClick={onClick}>
        <h2 className='event-item-header clickable'>{event.event}</h2>
        <p className="event-item-description">{event.description}</p>
        <div className="event-item-date-location">
          <p className="event-item-location">{event.location}</p>
          <p className="event-item-date">{new Date(event.date).toISOString().split('T')[0]} at {event.time}</p>
        </div>
      </div>
    );
  }
  
  export default EventListItem;