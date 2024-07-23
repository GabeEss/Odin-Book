import HandleRequestComponent from './handle-request-component';
import {Link} from 'react-router-dom';

function FriendRequestList({friendRequests, setGetRequests, getRequests}) {

    return(
        <div className='friend-request-container'>
            {friendRequests && friendRequests.length === 0 ? null
            : <div className="friend-request-list">
                <h2>Friend Requests</h2>
                {friendRequests.map((request) => {
                    return (
                        <div className='friend-request-item' key={request._id}>
                            <div className='friend-request-user-display'>
                                {/* <div className="friend-display-item" style={{backgroundColor: request.displayColor}}></div> */}
                                <p>Friend request from <Link to={`/user/${request._id}`}>{request.username}</Link>.</p>
                            </div>
                            <HandleRequestComponent 
                                id={request}
                                setFriendChange={setGetRequests}
                                friendChange={getRequests}
                            />
                        </div>
                    )
                })}
                </div>
            }
        </div>
    )
}

export default FriendRequestList;