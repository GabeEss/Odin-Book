import {Link} from 'react-router-dom';

function AttendanceGoing({event}) {
    return(
        <div className="attendance-going-container">
            <h3>Going</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-going' key={member.user._id}>
                            {member.status === 'going' && event.owner === member.user._id ? 
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username + ` (admin)`}</Link></p> : member.status === 'going' ?
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username}</Link></p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceGoing;