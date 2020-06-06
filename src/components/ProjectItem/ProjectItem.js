import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import PropTypes from 'prop-types';
import './ProjectItem.css';

// images
import { CalendarIcon, VacanciesIcon } from '../../images';

export default class ProjectItem extends Component {
  formatProjectDate = date => {
    const projectDate = new Date(date);
    const currentDate = new Date();
    const diffInDays = differenceInDays(currentDate, projectDate);
    if (diffInDays > 7) {
      return format(projectDate, 'L/d/yyyy');
    } else return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  render() {
    const {
      project: { id, name, description, tags, date_created, openVacancies = 1 }
    } = this.props;
    return (
      <article className="project card">
        <div className="project-left">
          <h3>
            <Link to={`/project-dash/${id}`}>{name}</Link>
          </h3>
          <p className="description">{description}</p>
        </div>
        <div className="project-right">
          <p className="tags">
            {tags.map((tag, i) => {
              return (
                <span key={i} className="tag">
                  {tag}
                </span>
              );
            })}
          </p>
          <div>
            <div className="info-item">
              <CalendarIcon />
              <p>{this.formatProjectDate(date_created)}</p>
            </div>
            <div className="info-item">
              <VacanciesIcon />
              <p>{openVacancies} open position{+openVacancies !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired
};
