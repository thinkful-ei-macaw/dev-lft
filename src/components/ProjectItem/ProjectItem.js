import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProjectItem.css';

// images
import { CalendarIcon, VacanciesIcon } from '../../images';

export default class ProjectItem extends Component {
  render() {
    const { project: { id, name, description, tags, date_created } } = this.props;
    return (
      <article className="project">
        <div className="project-left">
          <h3>
            <Link to={`/project-dash/${id}`}>{name}</Link>
          </h3>
          <p className="description">{description}</p>
        </div>
        <div className="project-right">
          <p className="tags">
            {tags.map((tag, i) => {
              return <span key={i} className="tag">{tag}</span>;
            })}
          </p>
          <div className="info-item">
            <CalendarIcon />
            <p>{new Date(date_created).toLocaleDateString()}</p>
          </div>
          <div className="info-item">
            <VacanciesIcon />
            <p>2 open positions</p>
          </div>
        </div>
      </article>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired
};
