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
                        <button 
                            key={friend._id} 
                            className='user-nav friend-list-item'
                            onClick={() => navigate(`/user/${friend._id}`)}
                            >
                            {/* {friend.displayColor} */}
                            {friend.username}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default FriendListDisplay;