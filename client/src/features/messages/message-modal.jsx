import Modal from 'react-modal';

function MessageModal({ isOpen, onRequestClose, messages }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Message Modal"
    >
      <h2>Received Messages</h2>
      {messages.length !== 0 ? messages.slice(-5).map((message, index) => (
        <p key={index}>{message}</p>
      )) : "No messages"}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default MessageModal;