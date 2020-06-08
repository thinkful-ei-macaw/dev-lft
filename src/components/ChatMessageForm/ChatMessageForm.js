import React, { Component } from 'react';
import ChatService from '../../services/chat-service';
import './ChatMessageForm.css';
import PropTypes from 'prop-types';

class ChatMessageForm extends Component {
  static defaultProps = {
    recipient_id: null,
    project_id: null,
    setNewMessage: () => {}
  };

  state = {
    body: '',
    error: null
  };

  setBody = text => {
    this.setState({ body: text });
  };

  onSend = e => {
    e.preventDefault();
    this.setState({ error: null });

    const { body } = this.state;
    const { recipient_username, request_id } = this.props;
    const newMessage = {
      body,
      recipient_username,
      request_id
    };
    ChatService.postChatMessage(newMessage)
      .then(res => {
        this.setState({ error: null, body: '' });
        return this.props.setNewMessage({
          ...res.resultingMessage,
          isAuthor: true
        });
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { error } = this.state;
    return (
      <form className="ChatMessageForm" onSubmit={e => this.onSend(e)}>
        <div role="alert">{error && <p>{error.error}</p>}</div>
        <label htmlFor="body">Reply:</label>
        <input
          type="text"
          id="body"
          name="body"
          required
          value={this.state.body}
          onChange={e => this.setBody(e.target.value)}
        ></input>
        <button type="submit">Send</button>
      </form>
    );
  }
}

ChatMessageForm.propType = {
  recipient_id: PropTypes.number.isRequired,
  project_id: PropTypes.number.isRequired,
  setNewMessage: PropTypes.func.isRequired
};

export default ChatMessageForm;
