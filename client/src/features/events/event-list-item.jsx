function EventListItem({ event, onClick}) {
    return (
      <div className='event-item' onClick={onClick}>
        <h2 className='clickable'>{event.event}</h2>
        <p>{event.description}</p>
        <p>Date: {new Date(event.date).toISOString().split('T')[0]} at {event.time}</p>
        <p>{event.location}</p>
      </div>
    );
  }
  
  export default EventListItem;