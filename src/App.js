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

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Nav />
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <Route path='/feed' component={FeedPage} />
          <Route path='/my-projects' component={ProjectsPage} />
          <Route path='/project-form' component={ProjectForm} />
          <Route path='/users/:user_id' component={UserProfile} />
          <Route exact path='/chats' component={Chat} />
          <Route path='/chats/messages' component={ChatMessages} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}
