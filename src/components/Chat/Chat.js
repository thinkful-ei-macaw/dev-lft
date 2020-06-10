import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Avatar from '../Avatar/Avatar';
import ChatService from '../../services/chat-service';
import ChatMessages from '../ChatMessages/ChatMessages';
import UserContext from '../../contexts/UserContext';
import './Chat.css';

// images
import { ReplyIcon } from '../../images';

class Chat extends Component {
  state = {
    chats: [],
    activeChat: null,
    activeFilter: '',
    error: null,
    interval_id: null,
    chatViewOpen: false
  };

  static contextType = UserContext;

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

    this.context.startLoading();
    ChatService.getChats()
      .then(chats => {
        this.setState({
          chats,
          activeChat: chats.length ? chats[0] : null
        });
        this.context.stopLoading();
      })
      .catch(res => {
        this.setState({ error: res.error || 'Something went wrong. Please try again later' });
        this.context.stopLoading();
      });
  };

  setActiveChat = chat => {
    this.setState({ activeChat: chat, chatViewOpen: true });
  }

  handleCloseChatView = () => {
    this.setState({
      chatViewOpen: false
    })
  }

  getFilters(chats) {
    let projectNames = {};
    chats.forEach(chat => {
      let project = chat.project_name.toLowerCase();
      projectNames[project] = true;
    })

    return Object.keys(projectNames);
  }

  setActiveFilter = e => {
    const { value } = e.target;
    this.setState({
      activeFilter: value
    })
  }

  projectFilter = chat => {
    const { activeFilter } = this.state;
    if (activeFilter !== '') {
      return chat.project_name.toLowerCase() === activeFilter.toLowerCase();
    } else {
      return true;
    }
  }

  render() {
    const { chats, error, activeChat, activeFilter, chatViewOpen } = this.state;
    const filters = this.getFilters(chats);
    return (
      <section className="page chat-page">
        <Helmet>
          <title>Chats - Dev LFT</title>
        </Helmet>
        <header>
          <div className="wrapper">
            <h2>Chats</h2>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {error
              ? <div role="alert" className="card info error">{error}</div>
              : ''}

            <div className="grid card">
              <div className="column column-1-3 list-container">
                <form className="chat-options">
                  <div className="input-group">
                    <div className="input">
                      <label className="hidden" htmlFor="filter">Filter By Project:</label>
                      <select id="filter" name="filter" disabled={!chats.length} value={activeFilter} onChange={this.setActiveFilter}>
                        <option value="">All</option>
                        {filters.map((filter, i) => (
                          <option key={i} value={filter}>{filter}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </form>
                <ul className="chat-list">
                  {chats.length
                    ? chats.filter(this.projectFilter).map((chat, i) => (
                      <li
                        key={i}
                        className={`user ${activeChat.chat_id === chat.chat_id ? 'active' : ''}`} role="button"
                        onClick={() => this.setActiveChat(chat)}
                      >
                        <Avatar
                          first_name={chat.first_name}
                          last_name={chat.last_name}
                        />
                        <div className="content">
                          <h4>{chat.first_name} {chat.last_name[0]}</h4>
                          <p className="last-message">
                            {(chat.isOwner && chat.request_status !== 'pending') || !chat.isReply
                              ? <ReplyIcon />
                              : ''}
                            {chat.request_status === 'pending'
                              ? chat.body
                              : `Request ${chat.request_status}.`}
                          </p>
                        </div>

                        <span className="date">
                          {ChatService.getFormattedDate(chat.date_created)}
                        </span>
                      </li>
                    ))
                    : <li className="empty">No chats, yet!</li>}
                </ul>
              </div>
              <div className="column column-2-3">
                {activeChat
                  ? <ChatMessages chat={activeChat} open={chatViewOpen} onClose={this.handleCloseChatView} onRequest={this.setChats} />
                  : ''}
              </div>
            </div>

          </div>

        </div>
      </section>
    );
  }
}
export default Chat;
