import React, { Component } from 'react';
import config from '../../config';
import './ChatMessageForm.css';

class ChatMessageForm extends Component {
  static defaultProps = {
    recipient_id: null,
    project_id: null
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
    const { recipient_id, project_id } = this.props;
    const newMessage = {
      body,
      recipient_id,
      project_id
    };

    fetch(`${config.API_ENDPOINT}/chats`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      },
      body: JSON.stringify(newMessage)
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ error: null, body: '' });
        return this.props.setNewMessage(res.resultingMessage);
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { error } = this.state;
    return (
      <form className="ChatMessageForm" onSubmit={e => this.onSend(e)}>
        <div role="alert">{error && <p>{error}</p>}</div>
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
export default ChatMessageForm;
