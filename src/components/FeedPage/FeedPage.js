import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ProjectApiService from '../../services/project-api-service';
import ProjectItem from '../ProjectItem/ProjectItem';
import './FeedPage.css';

export default class FeedPage extends Component {
  state = {
    vacantProjects: [],
    error: null
  };

  componentDidMount() {
    ProjectApiService.getAllProjects()
      .then(projects => {
        this.setState({ vacantProjects: projects });
      })
      .catch(res => {
        this.setState({ error: res.error || res.message })
      });
  }

  render() {
    return (
      <section className="page feed">
        <Helmet>
          <title>Latest Projects - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>Latest Projects</h2>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {this.state.vacantProjects.length !== 0 ? (
              <div>
                {this.state.vacantProjects.map((project, i) => {
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
