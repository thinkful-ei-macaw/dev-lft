import React from 'react';
import Button from '../Button/Button';

const ChatModal = ({
  handleNewMessage = () => { },
  handleCloseChatModal = () => { },
  request = {}
}) => {
  return (
    <form onSubmit={handleNewMessage} className="modal" autoComplete="off">
      <div className="input-group">
        <div className="input">
          <label htmlFor="chat-message">Message {request.first_name} {request.last_name}:</label>
          <input autoFocus type="text" name="chat-message" id="chat-message" placeholder="Say something" required />
        </div>
      </div>
      <Button type="submit">Send</Button>
      <Button className="clear" onClick={handleCloseChatModal}>
        Cancel
      </Button>
    </form>
  );
};

export default ChatModal;
