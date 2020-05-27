import React, { Component } from 'react';
import './ProjectPage.css';
import { Button } from '../Utils/Utils';

export default class ProjectsPage extends Component {
  render() {
    return (
      <div className="projects-page">
        <Button className="start-project" onClick={e => {e.preventDefault(); this.props.history.push('/project-form')}}>Create a new project</Button>
        <h2>Projects i'm involved in:</h2>
        <ul>
          <li>Test Project1</li>
          <li>Test Project2</li>
          <li>Test Project3</li>
          <li>Test Project4</li>
        </ul>
      </div>
    )
  }
}

