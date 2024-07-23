import OwnerOptionsComponent from './owner-options-component';
import JoinEventComponent from './join-event-component';
import LeaveEventComponent from './leave-event-component';
import AttendanceDisplayContainer from './attendance-display-container';
import PostListDisplay from '../posts/post-list-display';

function EventDisplay({ event, isOwner, isMember, setGetEvent, getEvent }) {
    return(
        <div className="event-display">
            <h1>{event.event}</h1>
            <div className='event-details-attendance-posts'>
                <div className='event-details'>
                    <h3>Event Information</h3>
                    <p>Description: {event.description}</p>
                    <div className='event-item-date-location event-details-date-location'>
                        <p>Date: {new Date(event.date).toISOString().split('T')[0]} at {event.time}</p>
                        <p>Location: {event.location}</p>
                    </div>
                </div>
                <div className='event-posts'>
                    <PostListDisplay/>
                </div>
                <div className='event-options-and-attendance'>
                    {isOwner ? <div>
                            <h3 className='user-options-header'>Owner Options</h3>
                            <OwnerOptionsComponent event={event} setGetEvent={setGetEvent} getEvent={getEvent}/>
                        </div> : 
                            isMember && !isOwner ? <div>
                                <h3 className='user-options-header'>User Options</h3>
                                <LeaveEventComponent setGetEvent={setGetEvent} getEvent={getEvent}/> 
                                </div> : 
                            !isMember && !isOwner ? <div>
                                <h3 className='user-options-header'>User Options</h3>
                                <JoinEventComponent setGetEvent={setGetEvent} getEvent={getEvent}/>
                                </div> 
                    : null }
                    {isMember ? <AttendanceDisplayContainer event={event} setGetEvent={setGetEvent} getEvent={getEvent} isOwner={isOwner}/> :
                    null }
                </div>
            </div>
        </div>
    )
}

export default EventDisplay;