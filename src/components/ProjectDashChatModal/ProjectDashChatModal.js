import React from 'react';

const ProjectDashChatModal = ({
  handleNewMessage = () => {},
  handleCloseChatModal = () => {}
}) => {
  return (
    <div className="chat-modal">
      <form onSubmit={handleNewMessage} className="start-chat-form">
        <label htmlFor="chat-message">What's the message?</label>
        <input type="text" name="chat-message" id="chat-message" />
        <button type="submit">Send</button>
        <button onClick={handleCloseChatModal} type="button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProjectDashChatModal;
