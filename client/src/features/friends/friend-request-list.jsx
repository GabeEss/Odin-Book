import HandleRequestComponent from './handle-request-component';

function FriendRequestList({friendRequests, setGetRequests, getRequests}) {

    return(
        <div className="friend-request-list">
            {friendRequests && friendRequests.length === 0 ? null
            : <div>
                <h2>Friend Requests</h2>
                {friendRequests.map((request) => {
                    return (
                        <div key={request._id}>
                            {/* {request.displayColor} */}
                            {request.username}
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