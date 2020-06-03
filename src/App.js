import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import LandingPage from './components/LandingPage/LandingPage';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProjectForm from './components/ProjectForm/ProjectForm';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import FeedPage from './components/FeedPage/FeedPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import Chat from './components/Chat/Chat';
import ChatMessages from './components/ChatMessages/ChatMessages';
import Settings from './components/Settings/Settings';
import ProjectDash from './components/ProjectDash/ProjectDash';

import UserContext from './contexts/UserContext';
import TokenService from './services/token-service';
import AuthApiService from './services/auth-api-service';

export default class App extends Component {
  state = {
    user: {
      username: '',
      first_name: '',
      last_name: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      date_created: '',
      isAuth: TokenService.hasAuthToken()
    },
    error: null
  };

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      this.handleAuth();
    }
  }

  handleAuth = () => {
    AuthApiService.getUserProfile()
      .then(user => this.setState({ user: { ...user, isAuth: true } }))
      .catch(error => this.setState({ ...error, user: { isAuth: false } }));
  };

  handleLogOut = () => {
    TokenService.clearAuthToken();
    this.handleAuth();
  };

  handleUserUpdate = updatedFields => {
    this.setState({ user: { ...this.state.user, ...updatedFields } });
  };

  render() {
    const { user } = this.state;
    const contextValues = {
      user,
      onAuth: this.handleAuth,
      onLogOut: this.handleLogOut,
      onProfileUpdate: this.handleUserUpdate
    };

    return (
      <UserContext.Provider value={contextValues}>
        <Nav />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/settings" component={Settings} />
          <Route path="/feed" component={FeedPage} />
          <Route path="/my-projects" component={ProjectsPage} />
          <Route path="/project-form" component={ProjectForm} />
          <Route path="/project-dash/:project_id" component={ProjectDash} />
          <Route path="/users/:username" component={UserProfile} />
          <Route exact path="/chats" component={Chat} />
          <Route path="/chats/messages" component={ChatMessages} />
        </Switch>
        <Footer />
      </UserContext.Provider>
    );
  }
}
