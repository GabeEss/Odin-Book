import { useState, useContext } from 'react';
import { OpenMessagesContext } from './open-messages-context';
import MessageListContainer from './message-list-container';

function BottomMessagesContainer() {
    const {openMessages, setOpenMessages} = useContext(OpenMessagesContext);
    const [numItems, setNumItems] = useState(3); // max number of message containers to display

    return(
        <div className='bottom-messages-display'>
            {openMessages ? openMessages.slice(0, numItems).map((notification, index) => 
                <MessageListContainer/>
            )
            : null}
        </div>
    )
}

export default BottomMessagesContainer;