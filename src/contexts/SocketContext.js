import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';

const SocketContext = React.createContext({
  clientUsername: '',
  clientConnection: {},
  clientNotifications: [],
  clientChats: [],
  clientPosts: [],
  setAcceptChats: () => null,
  setAcceptPosts: () => null,
  handleMessage: () => null,
  clearClientNotifications: () => null,
  clearClientChats: () => null,
  clearClientPosts: () => null
});

export default SocketContext;

export class SocketProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientUsername: '',
      clientConnection: {},
      clientNotifications: [],
      clientChats: [],
      clientPosts: []
    };
  }

  async componentDidMount() {
    // For now, we'll just grab the connection quick and dirty-like
    try {
      const userProfile = await AuthApiService.getUserProfile();
      // TODO: Clean this up and use env variables
      const clientConnection = new WebSocket(
        `ws://localhost:8000/${userProfile.username}`
      );
      // On new message from server, send though message handler
      clientConnection.onmessage = msg => this.handleMessage(msg);
      if (this._isMounted) {
        this.setState({
          clientConnection,
          clientUsername: userProfile.username
        });
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  clearClientNotifications = () => this.setState({ clientNotifications: [] });
  clearClientChats = () => this.setState({ clientChats: [] });
  clearClientPosts = () => this.setState({ clientPosts: [] });

  setAcceptChats = status =>
    this.state.clientConnection.send(
      JSON.stringify({ changeRoom: true, receiveChats: status })
    );

  setAcceptPosts = status =>
    this.state.clientConnection.send(
      JSON.stringify({ changeRoom: true, receivePosts: status })
    );

  handleMessage = message => {
    const messageData = JSON.parse(message.data);
    if (messageData.messageType === 'chat') {
      this.setState({
        clientChats: [messageData.content, ...this.state.clientChats]
      });
    }

    if (messageData.messageType === 'post') {
      this.setState({
        clientPosts: [messageData.content, ...this.state.clientPosts]
      });
    }

    if (messageData.messageType === 'notification') {
      this.setState({
        clientNotifications: [
          messageData.content,
          ...this.state.clientNotifications
        ]
      });
    }
  };

  render() {
    const value = {
      clientConnection: this.state.clientConnection,
      clientNotifications: this.state.clientNotifications,
      clientChats: this.state.clientChats,
      clientPosts: this.state.clientPosts,
      setAcceptChats: this.setAcceptChats,
      setAcceptPosts: this.setAcceptPosts,
      clearClientChats: this.clearClientChats,
      clearClientPosts: this.clearClientPosts
    };

    return (
      <SocketContext.Provider value={value}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }
}
