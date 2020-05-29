import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { format } from 'date-fns';
import config from '../../config';
import ChatMessageForm from '../ChatMessageForm/ChatMessageForm';
import './ChatMessages.css';

class ChatMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      redirect: false,
      first_name: '',
      last_name: '',
      project_name: '',
      error: null,
      interval_id: null
    };
  }

  componentDidMount() {
    /* If user arrives at this route with a chat_id, send them back
     to the chats list */
    if (!this.props.history.location.state.chat_id) {
      this.setState({ redirect: true });
    }
    this.setState({ ...this.props.history.location.state });
    this.getAllMessages();
    const checkMessages = setInterval(() => {
      this.getAllMessages();
    }, 30000);
    this.setState({ interval_id: checkMessages });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  getAllMessages = () => {
    const { chat_id } = this.props.history.location.state;
    fetch(`${config.API_ENDPOINT}/chats/${chat_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${window.localStorage.getItem(config.TOKEN_KEY)}`
      }
    })
      .then(res => res.json())
      .then(allMessages => this.setState({ ...allMessages }))
      .catch(error => this.setState({ error }));
  };

  getFormattedDate = date => {
    // TODO: If > 24 hours from now, show date instead
    // TODO: Refactor into shared util with Chat
    return format(new Date(date), 'hh:mmaa');
  };

  getNameInitials(firstName, lastName) {
    // TODO: Refactor into shared util with Chat
    // Helps avoid NaN warning from React
    // by ensuring any response is a string.
    return (firstName[0] + lastName[0]).toString();
  }

  setNewMessage = message => {
    return this.setState({
      allMessages: [message, ...this.state.allMessages]
    });
  };

  render() {
    const {
      redirect,
      allMessages,
      first_name,
      last_name,
      project_name,
      project_id,
      recipient_id,
      error
    } = this.state;

    return (
      <section className="Messages">
        <div role="alert">{error && <p>{error}</p>}</div>
        <Link to="/chats" className="Messages__header">
          &larr;
          <span className="Messages__logo">
            <span className="Messages__logo_initials">
              {this.getNameInitials(first_name, last_name)}
            </span>
          </span>
          <p>
            <span className="Messages__name">{first_name}</span>
            <span className="Messages__project">({project_name})</span>
          </p>
        </Link>
        {redirect ? (
          <Redirect to="/chat" />
        ) : (
          <ul className="Messages__list">
            {allMessages.map(message => (
              <li
                key={message.id}
                className={`Messages__item ${
                  message.author_id !== recipient_id ? 'author' : ''
                }`}
              >
                <span className="Messages__body">{message.body}</span>
                <span className="Messages__time">
                  {this.getFormattedDate(message.date_created)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <ChatMessageForm
          project_id={project_id}
          recipient_id={recipient_id}
          setNewMessage={this.setNewMessage}
        />
      </section>
    );
  }
}
export default ChatMessages;
