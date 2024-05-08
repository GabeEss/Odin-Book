import OwnerOptionsComponent from './owner-options-component';
import JoinEventComponent from './join-event-component';
import LeaveEventComponent from './leave-event-component';
import AttendanceDisplayContainer from './attendance-display-container';

function EventDisplay({ event, isOwner, isMember, setGetEvent, getEvent }) {
    return(
        <div className="event-display">
            <h2>{event.event}</h2>
            {isOwner ? <OwnerOptionsComponent event={event} setGetEvent={setGetEvent} getEvent={getEvent}/> : 
            isMember && !isOwner ? <LeaveEventComponent setGetEvent={setGetEvent} getEvent={getEvent}/> : 
            !isMember && !isOwner ? <JoinEventComponent setGetEvent={setGetEvent} getEvent={getEvent}/> : null }
            <p>Description: {event.description}</p>
            <p>Date: {new Date(event.date).toISOString().split('T')[0]} at {event.time}</p>
            <p>Location: {event.location}</p>
            {isMember ? <AttendanceDisplayContainer event={event} setGetEvent={setGetEvent} getEvent={getEvent} isOwner={isOwner}/> :
            null }
        </div>
    )
}

export default EventDisplay;