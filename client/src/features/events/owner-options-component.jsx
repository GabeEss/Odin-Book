import UpdateEventComponent from './update-event-component';
import DeleteEventComponent from './delete-event-component';

function OwnerOptionsComponent({event, setGetEvent, getEvent}) {
    return(
        <div className='owner-options'>
            <UpdateEventComponent event={event} setGetEvent={setGetEvent} getEvent={getEvent}/>
            <DeleteEventComponent/>
        </div>
    );
}

export default OwnerOptionsComponent;