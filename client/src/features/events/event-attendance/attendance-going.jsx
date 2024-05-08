function AttendanceGoing({event}) {
    return(
        <div className="attendance-going-container">
            <h3>Going</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-going' key={member.user._id}>
                            {member.status === 'going' && event.owner === member.user._id ? 
                            <p>{member.user.username + ` (admin)`}</p> : member.status === 'going' ?
                            <p>{member.user.username}</p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceGoing;