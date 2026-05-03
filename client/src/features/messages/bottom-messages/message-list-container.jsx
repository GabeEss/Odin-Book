import MessageList from '../message-list-display';

function MessageListContainer({ openUser, openUsers, setOpenUsers }) {
    const handleCloseContainer = () => {
        let tempArr = openUsers.filter(user => user._id != openUser._id);
        setOpenUsers(tempArr);
    }
    
  return (
    <div className='message-list-container'>
        <MessageList modalUserId={openUser._id}/>
        <button
            className='close-message-list-button'
            title='Close'
            isOpen={isOpen}
            onClick={handleCloseContainer}>
                X
        </button>
    </div>
  );
}

export default MessageListContainer;