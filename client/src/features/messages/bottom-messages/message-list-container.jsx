import { useState } from 'react';
import MessageList from '../message-list-display';
import {useNavigate} from 'react-router-dom';

function MessageListContainer({ modalUser }) {

    const [isOpen, setIsOpen] = useState(false); // Determines if the message modal is open
    // const [modalUser, setModalUser] = useState(null);

    const closeContainer = () => {
        setIsOpen(false);
        // setModalUser(null);
    }
    
  return (
    <div>
        {isOpen ? <div className='message-list-container'>
            {/* <MessageList modalUserId={modalUser._id}/> */}
            Start Small
            <button
                className='close-message-list-button'
                title='Close'
                isOpen={isOpen}
                onClick={closeContainer}>
                    X
            </button>
        </div> : null}
    </div>
  );
}

export default MessageListContainer;