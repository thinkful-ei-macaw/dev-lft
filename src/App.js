import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import ProjectForm from './components/ProjectForm/ProjectForm';
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import FeedPage from './components/FeedPage/FeedPage';

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/projects' component={ProjectsPage} />
        <Route path='/projects/new' component={ProjectForm} />
        <Route path='/feed' component={FeedPage} />
      </Switch>
    );
  }
}
