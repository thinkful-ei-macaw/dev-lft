import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import ChatService from '../../services/chat-service';
import ChatMessageForm from '../ChatMessageForm/ChatMessageForm';
import './ChatMessages.css';
import PropTypes from 'prop-types';

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
    if (this.props.history.location.state === undefined) {
      this.setState({ redirect: true });
    } else {
      this.setState({ ...this.props.history.location.state });
      this.setAllMessages();

      const checkMessages = setInterval(() => {
        this.setAllMessages();
      }, 30000);
      this.setState({ interval_id: checkMessages });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  setAllMessages = () => {
    const { chat_id } = this.props.history.location.state;
    ChatService.getAllChatMessages(chat_id)
      .then(allMessages => this.setState({ ...allMessages }))
      .catch(error => this.setState({ error }));
  };

  setNewMessage = message => {
    return this.setState({
      allMessages: [message, ...this.state.allMessages]
    });
  };

  render() {
    const {
      closed,
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
        {redirect ? <Redirect to="/chats" /> : null}
        <div role="alert">{error && <p>{error.error}</p>}</div>
        <Link to="/chats" className="Messages__header">
          &larr;
          <span className="Messages__logo">
            <span className="Messages__logo_initials">
              {ChatService.getNameInitials(first_name, last_name)}
            </span>
          </span>
          <p>
            <span className="Messages__name">{first_name}</span>
            <span className="Messages__project">({project_name})</span>
          </p>
        </Link>
        <ul className="Messages__list">
          {allMessages.map(message => (
            <li
              key={message.id}
              className={`Messages__item ${message.isAuthor ? 'author' : ''}`}
            >
              <span className="Messages__body">{message.body}</span>
              <span className="Messages__time">
                {ChatService.getFormattedDate(message.date_created)}
              </span>
            </li>
          ))}
        </ul>
        {closed ? (
          <p className="Messages__closed">
            This chat has been closed by the project owner.
          </p>
        ) : (
          <ChatMessageForm
            project_id={project_id}
            recipient_id={recipient_id}
            setNewMessage={this.setNewMessage}
          />
        )}
      </section>
    );
  }
}

ChatMessages.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.object
    })
  }),
  allMessages: PropTypes.array,
  redirect: PropTypes.bool,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  project_name: PropTypes.string,
  error: PropTypes.object,
  interval_id: PropTypes.number
};

export default ChatMessages;
