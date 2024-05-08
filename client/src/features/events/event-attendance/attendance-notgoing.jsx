function AttendanceNotGoing({event}) {
    return(
        <div className="attendance-not-going-container">
            <h3>Not Going</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-not-going' key={member.user._id}>
                            {member.status === 'notGoing' && event.owner === member.user._id ? 
                            <p>{member.user.username + ` (admin)`}</p> : member.status === 'notGoing' ?
                            <p>{member.user.username}</p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceNotGoing;