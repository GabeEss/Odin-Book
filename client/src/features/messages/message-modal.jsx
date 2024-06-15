import Modal from 'react-modal';
import MessageList from './message-list-display';
import {useNavigate} from 'react-router-dom';

function MessageModal({ isOpen, onRequestClose, modalUser }) {
  const nav = useNavigate();

  const handleModalUserClick = () => {
    nav(`/messages/${modalUser._id}`);
    onRequestClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Message Modal"
    >
      <h2
        role='button'
        tabIndex="0"
        onClick={() => handleModalUserClick()}>
          {modalUser.username}</h2>
      <MessageList modalUserId={modalUser._id}/>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default MessageModal;