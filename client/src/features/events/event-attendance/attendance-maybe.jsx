import {Link} from 'react-router-dom';

function AttendanceMaybe({event}) {
    return(
        <div className="attendance-maybe-container">
            <h3>Maybe</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-maybe' key={member.user._id}>
                            {member.status === 'maybe' && event.owner === member.user._id ? 
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username + ` (admin)`}</Link></p> : member.status === 'maybe' ?
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username}</Link></p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceMaybe;