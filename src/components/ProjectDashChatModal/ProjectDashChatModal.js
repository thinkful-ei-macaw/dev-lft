import React from 'react';

const ProjectDashChatModal = props => {
  return (
    <div className="chat-modal">
      <form onSubmit={props.handleNewMessage} className="start-chat-form">
        <label htmlFor="chat-message">What's the message?</label>
        <input type="text" name="chat-message" id="chat-message" />
        <button type="submit">Send</button>
        <button onClick={props.handleCloseChatModal} type="button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProjectDashChatModal;
