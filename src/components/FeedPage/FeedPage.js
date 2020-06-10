import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ProjectApiService from '../../services/project-api-service';
import ProjectItem from '../ProjectItem/ProjectItem';
import UserContext from '../../contexts/UserContext';
import './FeedPage.css';

export default class FeedPage extends Component {
  state = {
    vacantProjects: [],
    error: null,
    activeFilter: ''
  };

  static contextType = UserContext;

  componentDidMount() {
    this.context.startLoading();
    ProjectApiService.getAllProjects()
      .then(projects => {
        this.setState({ vacantProjects: projects });
        this.context.stopLoading();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
        this.context.stopLoading();
      });
  }

  getFilters(projects) {
    let projectTags = {};

    projects.forEach(project => {
      project.tags.map(tag => {
        let tags = tag.toUpperCase();
        projectTags[tags] = true;
      });
    });
    return Object.keys(projectTags);
  }

  setActiveFilter = e => {
    const { value } = e.target;
    this.setState({
      activeFilter: value
    });
  };

  render() {
    let { vacantProjects, activeFilter } = this.state;
    const filters = this.getFilters(vacantProjects);

    if (activeFilter !== '') {
      let filteredProjects = vacantProjects.filter(project => {
        return project.tags
          .map(tag => tag.toUpperCase())
          .includes(activeFilter);
      });

      vacantProjects = filteredProjects;
    }

    return (
      <section className="page feed">
        <Helmet>
          <title>Latest Projects - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>Latest Projects</h2>

            <form className="feed-options">
              <div className="input-group">
                <div className="input">
                  <label className="hidden" htmlFor="filter">
                    Filter By Skill:
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    disabled={!vacantProjects.length}
                    value={activeFilter}
                    onChange={this.setActiveFilter}
                  >
                    <option value="">All</option>
                    {filters.map((filter, i) => (
                      <option key={i} value={filter}>
                        {filter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </header>
        <div className="page-content">
          <div className="wrapper">
            {vacantProjects.length !== 0 ? (
              <div>
                {vacantProjects.map((project, i) => {
                  return <ProjectItem key={i} project={project} />;
                })}
              </div>
            ) : (
              <p className="project">No projects available!</p>
            )}
          </div>
        </div>
      </section>
    );
  }
}
