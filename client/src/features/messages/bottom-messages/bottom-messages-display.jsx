import { useState, useContext } from 'react';
import { UsersWithOpenMessagesContext } from './users-with-open-messages-context';
import MessageListContainer from './message-list-container';

function BottomMessagesDisplay() {
    const {openUsers, setOpenUsers} = useContext(UsersWithOpenMessagesContext);
    const NUM_ITEMS = 3;

    return(
        <div className='bottom-messages-display'>
            {openUsers ? openUsers.slice(0, NUM_ITEMS).map((openUser, index) => 
                <MessageListContainer openUser={openUser} openUsers={openUsers} setOpenUsers={setOpenUsers}/>
            )
            : null}
        </div>
    )
}

export default BottomMessagesDisplay;