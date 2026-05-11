import MessageList from '../message-list-display';

function MessageListContainer({ openUser, openUsers, setOpenUsers }) {

    const handleCloseContainer = () => {
        let tempArr = openUsers.filter(user => user._id != openUser._id);
        setOpenUsers(tempArr);
    }
    
  return (
    <div className='bottom-message-list-container'>
        <button
            className='close-bottom-message-list-button'
            title='Close'
            onClick={handleCloseContainer}>
                X
        </button>
        <MessageList modalUserId={openUser._id}/>
    </div>
  );
}

export default MessageListContainer;