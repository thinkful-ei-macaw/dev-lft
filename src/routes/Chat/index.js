import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Avatar from '../../components/Avatar';
import ChatService from '../../services/chat-api-service';
import ChatMessages from '../../components/ChatMessages';
import './Chat.css';

// images
import { ReplyIcon } from '../../images';
import { Link } from 'react-router-dom';

class Chat extends Component {
  constructor(props) {
    super(props);
    const preSelectedFilter =
      props.location.state && props.location.state.filter.toLowerCase();
    this.state = {
      chats: [],
      activeChatIdx: null,
      activeFilter: preSelectedFilter || '',
      error: null,
      chatViewOpen: false
    };
  }

  static defaultProps = {
    location: {}
  };

  componentDidMount() {
    // TODO: Figure out why component is
    // fully mounting -> unmounting -> mounting
    // on full refresh.
    if (this.props.webSocket.clientConnection.url) {
      this.setChats();
    }
  }

  setChats = () => {
    this.setState({ error: null });
    if (!this.state.activeChatIdx) {
      // this.props.user.startLoading();
    }
    ChatService.getChats()
      .then(chats => {
        this.setState(
          {
            chats,
            activeChatIdx: this.state.activeChatIdx
              ? this.state.activeChatIdx
              : 0
          },
          () =>
            this.getActiveChatMessages(
              this.state.chats[this.state.activeChatIdx]
            )
        );
        // this.props.user.stopLoading();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
        // this.props.user.stopLoading();
      });
  };

  setActiveChat = (chatIdx, autoOpen = true) => {
    // Set a new active Chat, grab the messages and put them into
    // the appropriate array by chat_id
    this.getActiveChatMessages(this.state.chats[chatIdx]);
    const chatIndex = this.state.chats.findIndex(
      c => c.chat_id === this.state.chats[chatIdx].chat_id
    );
    this.setState({ activeChatIdx: chatIndex, chatViewOpen: autoOpen });
  };

  getActiveChatMessages = chat => {
    const { chat_id } = chat;
    ChatService.getAllChatMessages(chat_id)
      .then(allMessages => {
        const chats = this.state.chats;
        const newChats = chats.map(c => {
          if (c.chat_id === chat_id) {
            return {
              ...c,
              messages: allMessages.allMessages
            };
          } else return c;
        });
        this.setState({
          chats: newChats
        });
      })
      .catch(error => this.setState({ error }));
  };

  onNewMessageSuccess = message => {
    this.setState({
      activeChat: {
        ...this.state.activeChat,
        messages: [message, ...this.state.activeChat.messages]
      }
    });
  };

  handleCloseChatView = () => {
    this.setState({
      chatViewOpen: false
    });
  };

  getFilters(chats) {
    let projectNames = {};
    if (!chats || chats.length === 0) return [];

    chats.forEach(chat => {
      let project = chat.project.project_name.toLowerCase();
      projectNames[project] = true;
    });

    return Object.keys(projectNames);
  }

  setActiveFilter = e => {
    const { value } = e.target;
    const { chats } = this.state;
    this.setState({ activeFilter: value }, () => {
      this.setActiveChatIdx(chats.filter(this.projectFilter)[0], false);
    });
  };

  projectFilter = chat => {
    const { activeFilter } = this.state;
    if (activeFilter !== '') {
      return (
        chat.project.project_name.toLowerCase() === activeFilter.toLowerCase()
      );
    } else {
      return true;
    }
  };
  render() {
    const {
      chats,
      error,
      activeChatIdx,
      activeFilter,
      chatViewOpen
    } = this.state;
    const filters = this.getFilters(chats);
    return (
      <section className="page chat-page">
        <Helmet>
          <title>Chats - Dev LFT</title>
        </Helmet>

        <h1 className="hidden" aria-hidden={true}>
          Your Account
        </h1>

        <header>
          <div className="wrapper">
            <h2>Chats</h2>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {error ? (
              <div role="alert" className="card info error">
                {error}
              </div>
            ) : (
              ''
            )}

            <div className="grid card">
              <div className="column column-1-3 list-container">
                <form className="chat-options">
                  <div className="input-group">
                    <div className="input">
                      <label className="hidden" htmlFor="filter">
                        Filter By Project:
                      </label>
                      <select
                        id="filter"
                        name="filter"
                        disabled={!chats.length}
                        value={activeFilter}
                        onChange={this.setActiveFilter}
                      >
                        <option value="">All</option>
                        {filters.map((filter, i) => (
                          <option key={i} value={filter}>
                            {filter}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
                <ul className="chat-list">
                  {chats.length ? (
                    chats.filter(this.projectFilter).map((chat, i) => (
                      <li
                        key={i}
                        className={`user ${
                          chats[activeChatIdx].chat_id === chat.chat_id
                            ? 'active'
                            : ''
                        }`}
                        role="button"
                        onClick={() => this.setActiveChat(i)}
                      >
                        <Avatar
                          first_name={chat.recipient.first_name}
                          last_name={chat.recipient.last_name}
                        />
                        <div className="content">
                          <h4>
                            {chat.recipient.first_name}{' '}
                            {chat.recipient.last_name[0]}
                          </h4>
                          <p className="last-message">
                            {(chat.project.isOwner &&
                              chat.project.request_status !== 'pending') ||
                            !chat.messages[0].isAuthor ? (
                              <ReplyIcon />
                            ) : (
                              ''
                            )}
                            {chat.project.request_status === 'pending'
                              ? chat.messages[0].body
                              : `Request ${chat.project.request_status}.`}
                          </p>
                        </div>

                        <span className="date">
                          {ChatService.getFormattedDate(
                            chat.messages[0].date_created
                          )}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="empty">No chats, yet!</li>
                  )}
                </ul>
              </div>
              <div className="column column-2-3">
                {activeChatIdx !== null ? (
                  <ChatMessages
                    chat={chats[activeChatIdx]}
                    open={chatViewOpen}
                    onClose={this.handleCloseChatView}
                    onUpdate={this.setChats}
                    onNewMessageSuccess={this.onNewMessageSuccess}
                  />
                ) : (
                  <div className="chat-view open chat-instructions">
                    <p>
                      Chats can only be initiated by project owners from
                      requests on a project's dashboard.
                    </p>
                    <Link to="/projects">Go to your projects</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default Chat;
