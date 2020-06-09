import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import ChatService from '../../services/chat-service';
import './Chat.css';

class Chat extends Component {
  state = {
    chats: [],
    error: null,
    interval_id: null
  };

  componentDidMount() {
    this.setChats();
    const checkChats = setInterval(() => {
      this.setChats();
    }, 30000);
    this.setState({ interval_id: checkChats });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  setChats = () => {
    this.setState({ error: null });
    ChatService.getChats()
      .then(chats => this.setState({ ...chats }))
      .catch(error => this.setState({ error }));
  };

  render() {
    const { chats, error } = this.state;
    return (
      <section className="Chat">
        <h2>Chats</h2>
        <div role="alert">{error && <p>{error.error}</p>}</div>
        <ul className="Chat__list">
          {chats.map(chat => (
            <li
              key={chat.recipient_username + chat.date_created}
              className="Chat__item"
            >
              <Link
                className="Chat__link"
                to={{
                  pathname: '/chats/messages',
                  state: {
                    chat_id: chat.chat_id,
                    closed: chat.closed,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    project_name: chat.project_name,
                    request_id: chat.request_id,
                    recipient_username: chat.recipient_username
                  }
                }}
              >
                <Avatar
                  first_name={chat.first_name}
                  last_name={chat.last_name}
                  className={'Chat__logo'}
                />
                <span className="Chat__name">{chat.first_name}</span>
                <span className="Chat__project">({chat.project_name})</span>
                <span className="Chat__preview">{chat.body}</span>
                <span className="Chat__date">
                  {ChatService.getFormattedDate(chat.date_created)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
export default Chat;
