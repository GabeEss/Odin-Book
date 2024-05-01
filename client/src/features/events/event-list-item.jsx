function EventListItem({ event, onClick}) {
    return (
      <div className='event-item clickable' onClick={onClick}>
        <h2>{event.event}</h2>
        <p>{event.description}</p>
        <p>Date: {new Date(event.date).toISOString().split('T')[0]} at {event.time}</p>
        <p>{event.location}</p>
        {/* <p>{event.owner}</p>
        <p>{event.date_created}</p>
        <div>
            <h3>Members</h3>
            {event.members.map((member) => (
                <p key={member._id}>{member}</p>
            ))}
        </div> */}
      </div>
    );
  }
  
  export default EventListItem;