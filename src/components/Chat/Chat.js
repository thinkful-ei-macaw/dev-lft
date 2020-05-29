import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import { format } from 'date-fns';
import './Chat.css';

class Chat extends Component {
  state = {
    chats: [],
    error: null,
    interval_id: null
  };

  componentDidMount() {
    this.getChats();

    const checkChats = setInterval(() => {
      this.getChats();
    }, 30000);
    this.setState({ interval_id: checkChats });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  getChats = () => {
    this.setState({ error: null });

    fetch(`${config.API_ENDPOINT}/chats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      }
    })
      .then(res => res.json())
      .then(chats => this.setState({ ...chats }))
      .catch(error => this.setState({ error }));
  };

  getNameInitials(firstName, lastName) {
    // TODO: Refactor into shared util with ChatMessages
    // Helps avoid NaN warning from React
    // by ensuring any response is a string.
    return (firstName[0] + lastName[0]).toString();
  }

  getFormattedDate = date => {
    // TODO: If > 24 hours from now, show date instead
    // TODO: Refactor into shared util with ChatMessages
    return format(new Date(date), 'hh:mmaa');
  };

  render() {
    const { chats, error } = this.state;
    return (
      <section className="Chat">
        <h2>Chats</h2>
        <div role="alert">{error && <p>{error}</p>}</div>
        <ul className="Chat__list">
          {chats.map(chat => (
            <li key={chat.chat_id} className="Chat__item">
              <Link
                className="Chat__link"
                to={{
                  pathname: '/chats/messages',
                  state: {
                    chat_id: chat.chat_id,
                    first_name: chat.first_name,
                    last_name: chat.last_name,
                    project_name: chat.project_name,
                    project_id: chat.project_id,
                    recipient_id: chat.recipient_id
                  }
                }}
              >
                <span className="Chat__logo">
                  <span className="Chat__logo_initials">
                    {this.getNameInitials(chat.first_name, chat.last_name)}
                  </span>
                </span>
                <span className="Chat__name">{chat.first_name}</span>
                <span className="Chat__project">({chat.project_name})</span>
                <span className="Chat__preview">{chat.body}</span>
                <span className="Chat__date">
                  {this.getFormattedDate(chat.date_created)}
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
