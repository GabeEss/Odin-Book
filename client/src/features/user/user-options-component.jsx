import {useNavigate} from 'react-router-dom';

import RemoveFriendComponent from "../friends/remove-friend-component";
import SendFriendRequest from "../friends/send-friend-request-component";
import HandleRequestComponent from "../friends/handle-request-component";

function UserOptions({id, sentRequest, receivedRequest, isFriend, setFriendChange, friendChange}) {
    const nav = useNavigate();

    const handleMessage = () => {
        nav(`/messages/${id}`);
    }

    return (
        <div>
            <button onClick={handleMessage}>Send message</button>
            {isFriend ? <RemoveFriendComponent
                id={id}
                setFriendChange={setFriendChange}
                friendChange={friendChange}/> : 
            sentRequest ? <p>Friend request sent</p> : 
            receivedRequest ? 
            <HandleRequestComponent
                id={id}
                setFriendChange={setFriendChange}
                friendChange={friendChange}/> :
            !isFriend || !sentRequest || !receivedRequest ? 
            <SendFriendRequest 
                id={id}
                setFriendChange={setFriendChange}
                friendChange={friendChange}/> : null}
        </div>
    )
}

export default UserOptions;