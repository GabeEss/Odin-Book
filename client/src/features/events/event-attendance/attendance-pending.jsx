import {Link} from 'react-router-dom';

function AttendancePending({event}) {
    return(
        <div className="attendance-pending-container">
            <h3>No Response</h3>
            {event.members.map(member => {
                    return(
                        <div className='pending' key={member.user._id}>
                            {member.status === 'pending' && event.owner === member.user._id ? 
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username + ` (admin)`}</Link></p> : member.status === 'pending' ?
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username}</Link></p> : null}
                        </div>
                    );
                }
            )}
        </div>
    )
}

export default AttendancePending;