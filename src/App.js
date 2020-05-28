import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import ProjectForm from './components/ProjectForm/ProjectForm';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import FeedPage from './components/FeedPage/FeedPage';
import UserProfile from './components/UserProfile/UserProfile';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path={'/my-projects'} component={ProjectsPage} />
          <Route path={'/project-form'} component={ProjectForm} />
          <Route path={'/feed'} component={FeedPage} />
          <Route path={'/users/:user_id'} component={UserProfile} />
        </Switch>
      </div>
    );
  }
}
