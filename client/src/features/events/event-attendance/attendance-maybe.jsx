function AttendanceMaybe({event}) {
    return(
        <div className="attendance-maybe-container">
            <h3>Maybe</h3>
            {event.members.map(member => {
                    return(
                        <div className='attendance-maybe' key={member.user._id}>
                            {member.status === 'maybe' && event.owner === member.user._id ? 
                            <p>{member.user.username + ` (admin)`}</p> : member.status === 'maybe' ?
                            <p>{member.user.username}</p> : null}
                        </div>
                    );
                }  
            )}
        </div>
    )
}

export default AttendanceMaybe;