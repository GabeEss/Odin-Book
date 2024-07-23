function ProfileDisplay({user, self}) {
    return(
        <div>
            {self ? <div className="user-you"><h1 className="user-header">{user.username} </h1> <p> (you)</p></div> 
            : <h1 className="user-header">{user.username}</h1>}
            <div className="user-display" style={{backgroundColor: user.displayColor}}></div>
        </div>
    )
}

export default ProfileDisplay;