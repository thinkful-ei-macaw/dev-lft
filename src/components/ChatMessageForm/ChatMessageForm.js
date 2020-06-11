import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import ChatService from '../../services/chat-api-service';
import './ChatMessageForm.css';

class ChatMessageForm extends Component {
  static defaultProps = {
    recipient_id: null,
    project_id: null,
    disabled: false,
    onNewMessage: () => null
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
      .then(() => {
        this.setState({ error: null, body: '' });
        this.props.onNewMessage();
      })
      .catch(res => this.setState({ error: res.error || 'Something went wrong. Please try again later' }));
  };

  render() {
    const { error } = this.state;
    const { disabled } = this.props;
    return (
      <form className="chat-form" onSubmit={e => this.onSend(e)} autoComplete="off">
        {error
          ? <p role="alert" className="error">{error}</p>
          : ''}

        <div className="input-group pinned">
          <div className="input">
            <label className="hidden" htmlFor="body">Reply:</label>
            <input
              type="text"
              id="body"
              name="body"
              required
              placeholder="Say something"
              maxLength="280"
              disabled={disabled}
              value={this.state.body}
              onChange={e => this.setBody(e.target.value)}
            ></input>
          </div>
          <Button disabled={disabled} type="submit">Send</Button>
        </div>
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
