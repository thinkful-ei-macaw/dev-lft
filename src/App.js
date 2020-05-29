import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import ProjectForm from './components/ProjectForm/ProjectForm';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import FeedPage from './components/FeedPage/FeedPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import Chat from './components/Chat/Chat';
import ChatMessages from './components/ChatMessages/ChatMessages';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path={'/signup'} component={Signup} />
          <Route path={'/login'} component={Login} />
          <Route path={'/my-projects'} component={ProjectsPage} />
          <Route path={'/project-form'} component={ProjectForm} />
          <Route path={'/feed'} component={FeedPage} />
          <Route path={'/users/:user_id'} component={UserProfile} />
          <Route exact path={'/chats'} component={Chat} />
          <Route exact path={'/chats/messages'} component={ChatMessages} />
        </Switch>
      </div>
    );
  }
}
