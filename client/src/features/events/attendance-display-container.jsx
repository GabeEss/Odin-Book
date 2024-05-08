import AttendanceResponseComponent from './attendance-response-component';

import AttendanceGoing from './event-attendance/attendance-going';
import AttendanceMaybe from './event-attendance/attendance-maybe';
import AttendanceNotGoing from './event-attendance/attendance-notgoing';
import AttendancePending from './event-attendance/attendance-pending';

function AttendanceDisplayContainer({event, setGetEvent, getEvent, isOwner}) {
    return(
        <div className='attendance-display-container'>
            {isOwner ? null : <AttendanceResponseComponent
                setGetEvent={setGetEvent}
                getEvent={getEvent}
            />}
            <AttendancePending event={event}/>
            <AttendanceGoing event={event}/>
            <AttendanceMaybe event={event}/>
            <AttendanceNotGoing event={event}/>
        </div>
    )
}

export default AttendanceDisplayContainer;