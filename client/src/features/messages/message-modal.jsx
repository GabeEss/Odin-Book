import Modal from 'react-modal';
import MessageList from './message-list-display';
import {useNavigate} from 'react-router-dom';

function MessageModal({ isOpen, onRequestClose, modalUser }) {
  return (
    <Modal
      className='message-modal'
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Message Modal"
    >
      <MessageList modalUserId={modalUser._id}/>
      <button className='close-modal-button' title='Close' onClick={onRequestClose}>X</button>
    </Modal>
  );
}

export default MessageModal;