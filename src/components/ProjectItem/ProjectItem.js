import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ProjectItem.css';
import PropTypes from 'prop-types';

export default class ProjectItem extends Component {
  render() {
    let project = this.props.project;
    return (
      <div className="oneProject">
        <h3>
          <span className="bold">Name:</span>
          {project.name}
        </h3>
        <p>
          <span className="bold">Description:</span>
          {project.description}
        </p>
        <div>
          <span className="bold">Tags</span>
          {project.tags.map((tag, i) => {
            return <span key={i}> | {tag}</span>;
          })}
        </div>
        <p>
          <span className="bold">GitHub url:</span>
          {project.github_url}
        </p>
        <p>
          <span className="bold">Live url:</span>
          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
            {project.live_url}
          </a>
        </p>
        <p>
          <span className="bold">Trello url</span>
          {project.trello_url}
        </p>
        <Link to={`/project-dash/${project.id}`}>Go to dashboard</Link>
      </div>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired
};
