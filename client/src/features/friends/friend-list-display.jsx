import { useNavigate } from 'react-router-dom'; ;

function FriendListDisplay({friends}) {
    const navigate = useNavigate();

    return(
        <div className='friend-list'>
            <h2>Friends</h2>
            {friends && friends.length === 0 ? <p>No friends found</p>
            :
                friends.map((friend) => {
                    return (
                        <div
                        onClick={() => navigate(`/user/${friend._id}`)}
                        className='friend-list-item' key={friend._id}>
                            <div className="friend-display-item" style={{backgroundColor: friend.displayColor}}></div>
                            <p className='friend-list-name'>
                                {friend.username}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default FriendListDisplay;