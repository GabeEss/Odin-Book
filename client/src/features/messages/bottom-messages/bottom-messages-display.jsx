import { useState, useEffect, useContext } from 'react';
import { UsersWithOpenMessagesContext } from './users-with-open-messages-context';
import MessageListContainer from './message-list-container';

function BottomMessagesDisplay() {
    const {openUsers, setOpenUsers} = useContext(UsersWithOpenMessagesContext);
    const NUM_ITEMS = 3;

    // Adding a key allows the component to remount properly on context changes
    return(
        <div className='bottom-messages-display'>
            {openUsers ? openUsers.slice(0, NUM_ITEMS).map((openUser) => 
                <MessageListContainer key={openUser._id} openUser={openUser} openUsers={openUsers} setOpenUsers={setOpenUsers}/>
            )
            : null}
        </div>
    )
}

export default BottomMessagesDisplay;