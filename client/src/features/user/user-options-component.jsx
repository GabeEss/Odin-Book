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
        <div className='user-options'>
            <button className='send-message-userpage' onClick={handleMessage}>Send message</button>
            {isFriend ? <RemoveFriendComponent
                id={id}
                setFriendChange={setFriendChange}
                friendChange={friendChange}/> : 
            sentRequest ? null : 
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