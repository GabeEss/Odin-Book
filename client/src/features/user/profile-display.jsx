function ProfileDisplay({user}) {
    return(
        <div>
            <h1>{user.username}</h1>
            <div className="user-display" style={{backgroundColor: user.displayColor}}></div>
        </div>
    )
}

export default ProfileDisplay;