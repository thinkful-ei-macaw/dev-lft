import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/Utils/PrivateRoute';
import PublicOnlyRoute from './components/Utils/PublicOnlyRoute';
import PageNotFound from './components/Utils/PageNotFound/PageNotFound';
import LandingPage from './components/LandingPage/LandingPage';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import FeedPage from './components/FeedPage/FeedPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import Chat from './components/Chat/Chat';
import ChatMessages from './components/ChatMessages/ChatMessages';
import Account from './components/Account/Account';
import ProjectDash from './components/ProjectDash/ProjectDash';
import GlobalErrorBoundary from './components/ErrorBoundaries/GlobalErrorBoundary';

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
      isAuth: false
    },
    error: null
  };

  componentDidMount() {
    this.handleAuth();
  }

  handleAuth = () => {
    if (TokenService.hasAuthToken()) {
      AuthApiService.getUserProfile()
        .then(user => this.setState({ user: { ...user, isAuth: true } }))
        .catch(res => {
          this.setState({ error: res.error || 'Something went wrong. Please try again later', user: { isAuth: false } }, () => {
            throw new Error(this.state.error);
          });

        });
    } else {
      this.setState({ user: { isAuth: false } });
    }
  };

  handleLogOut = () => {
    TokenService.clearAuthToken();
    this.handleAuth();
  };

  handleUserUpdate = updatedFields => {
    this.setState({ user: { ...this.state.user, ...updatedFields } });
  };

  handleSetNotificaions = notificationSettings => {
    console.log(notificationSettings);
    this.setState({ user: { ...this.state.user, notifications: notificationSettings } });
  }

  render() {
    const { user } = this.state;
    const contextValues = {
      user,
      onAuth: this.handleAuth,
      onLogOut: this.handleLogOut,
      onProfileUpdate: this.handleUserUpdate,
      setNotifications: this.handleSetNotificaions
    };

    return (
      <UserContext.Provider value={contextValues}>
        <Route path="*" component={Nav} />
        <GlobalErrorBoundary>
          <Switch>
            <PublicOnlyRoute exact path="/" component={LandingPage} />
            <PublicOnlyRoute exact path="/signup" component={Signup} />
            <PublicOnlyRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute exact path="/feed" component={FeedPage} />
            <PrivateRoute exact path="/projects" component={ProjectsPage} />
            <PrivateRoute exact path="/projects/:project_handle" component={ProjectDash} />
            <PrivateRoute exact path="/users/:username" component={UserProfile} />
            <PrivateRoute exact path="/chats" component={Chat} />
            <PrivateRoute path="/chats/messages" component={ChatMessages} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </GlobalErrorBoundary>
        <Route path="*" component={Footer} />
      </UserContext.Provider>
    );
  }
}
