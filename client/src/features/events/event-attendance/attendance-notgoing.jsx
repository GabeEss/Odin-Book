import {Link} from 'react-router-dom';

function AttendanceNotGoing({event}) {
    return(
        <div className="attendance-not-going-container">
            <h3>Not Going</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-not-going' key={member.user._id}>
                            {member.status === 'notGoing' && event.owner === member.user._id ? 
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username + ` (admin)`}</Link></p> : member.status === 'notGoing' ?
                            <p><Link to={`/user/${member.user._id}`}>{member.user.username}</Link></p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceNotGoing;