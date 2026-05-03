import { useState, useContext } from 'react';
import { UsersWithOpenMessagesContext } from './users-with-open-messages-context';
import MessageListContainer from './message-list-container';

function BottomMessagesDisplay() {
    const {openUsers, setOpenUsers} = useContext(UsersWithOpenMessagesContext);
    const [numItems, setNumItems] = useState(3); // max number of message containers to display

    return(
        <div className='bottom-messages-display'>
            {openUsers ? openUsers.slice(0, numItems).map((openUser, index) => 
                <MessageListContainer openUser={openUser} openUsers={openUsers} setOpenUsers={setOpenUsers}/>
            )
            : null}
        </div>
    )
}

export default BottomMessagesDisplay;