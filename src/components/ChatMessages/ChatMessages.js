import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ChatService from '../../services/chat-api-service';
import ProjectDashService from '../../services/project-dash-service';
import Avatar from '../Avatar/Avatar';
import UserContext from '../../contexts/UserContext';
import ChatMessageForm from '../ChatMessageForm/ChatMessageForm';
import Button from '../Button/Button';
import './ChatMessages.css';

// images
import { CloseIcon, CheckIcon, BackIcon } from '../../images';

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
    this.chatList = React.createRef();
  }

  static defaultProps = {
    chat: {
      closed: false,
      first_name: 'John',
      last_name: 'Doe',
      project_name: 'Project Name',
      request_id: null,
      recipient_username: 'username',
      vacancy_name: 'Vacancy Name',
      isOwner: false,
      request_status: false
    },
    open: false,
    onClose: () => null
  };

  static contextType = UserContext;

  componentDidMount() {
    this.setAllMessages();
  }

  componentDidUpdate(oldProps) {
    if (this.props.chat.body !== oldProps.chat.body) {
      this.setAllMessages();
    } else {
      this.chatList.current.scrollTop = this.chatList.current.scrollHeight;
    }
  }

  setAllMessages = () => {
    const {
      chat: { chat_id }
    } = this.props;
    ChatService.getAllChatMessages(chat_id)
      .then(allMessages => {
        this.setState({ ...allMessages });
        this.chatList.current.scrollTop = this.chatList.current.scrollHeight;
      })
      .then(this.props.onUpdate)
      .catch(error => this.setState({ error }));
  };

  handleRequest = (request_id, status) => {
    ProjectDashService.patchRequest(status, request_id)
      .then(this.props.onUpdate)
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    const {
      chat: {
        closed,
        first_name,
        last_name,
        project_name,
        request_id,
        recipient_username,
        vacancy_name,
        isOwner = false,
        request_status
      },
      open,
      onClose = () => null
    } = this.props;

    const { allMessages, error } = this.state;
    const { user } = this.context;

    const headerMessage = isOwner
      ? request_status === 'pending'
        ? `wants to fill your ${vacancy_name} position`
        : request_status === 'denied'
        ? `wanted to fill your ${vacancy_name} position`
        : vacancy_name
      : `You requested to fill their ${vacancy_name} position`;

    return (
      <section className={`chat-view ${open ? 'open' : ''}`}>
        {error ? (
          <div role="alert" className="card info error">
            {error}
          </div>
        ) : (
          ''
        )}

        <header>
          <div className="user">
            <Button className="clear tablet" onClick={onClose}>
              <BackIcon />
            </Button>
            <Avatar first_name={first_name} last_name={last_name} />
            <div className="content">
              <h4>
                <Link to={`/users/${recipient_username}`}>
                  {first_name} {last_name[0]}
                </Link>
              </h4>
              <p title={headerMessage}>
                <span className="highlight">({project_name})</span>
                {headerMessage}
              </p>
            </div>
            {isOwner && request_status === 'pending' ? (
              <>
                <Button
                  className="clear"
                  onClick={() => this.handleRequest(request_id, 'approved')}
                >
                  <CheckIcon title="Approve this request" />
                </Button>
                <Button
                  className="clear"
                  onClick={() => this.handleRequest(request_id, 'denied')}
                >
                  <CloseIcon title="Deny this request" />
                </Button>
              </>
            ) : (
              ''
            )}
          </div>
        </header>
        <ul className="chats" ref={this.chatList}>
          {[...allMessages].reverse().map(message => (
            <li
              key={message.author_username + message.date_created}
              className={`message ${message.isAuthor ? 'author' : ''}`}
            >
              <header>
                {message.isAuthor ? (
                  <>
                    <Avatar
                      first_name={user.first_name}
                      last_name={user.last_name}
                    />
                    <h4 className="h5">You</h4>
                  </>
                ) : (
                  <>
                    <Avatar first_name={first_name} last_name={last_name} />
                    <h4 className="h5">
                      {first_name} {last_name}
                    </h4>
                  </>
                )}
                <span className="date">
                  {ChatService.getFormattedDate(message.date_created)}
                </span>
              </header>
              <p className="body">{message.body}</p>
            </li>
          ))}
          {request_status !== 'pending' ? (
            <li className="info">Request {request_status}.</li>
          ) : closed ? (
            <li className="info">This chat has been closed.</li>
          ) : (
            ''
          )}
        </ul>
        <ChatMessageForm
          request_id={request_id}
          recipient_username={recipient_username}
          onNewMessage={this.setAllMessages}
          disabled={request_status !== 'pending' || closed}
        />
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
