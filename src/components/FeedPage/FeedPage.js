import React, { Component } from 'react';
import { Section } from '../Utils/Utils';
import ProjectApiService from '../../services/project-api-service';
import ProjectItem from '../ProjectItem/ProjectItem';

export default class FeedPage extends Component {
  state = {
    vacantProjects: []
  };

  componentDidMount() {
    ProjectApiService.getAllProjects().then(projects => {
      console.log(projects);
      this.setState({ vacantProjects: projects });
    });
  }

  render() {
    return (
      <Section className="projects-page">
        <h2>Projects with vacancies</h2>
        {this.state.vacantProjects.length !== 0 ? (
          <div>
            {this.state.vacantProjects.map((project, i) => {
              return <ProjectItem key={i} project={project} />;
            })}
          </div>
        ) : (
          'No projects available!'
        )}
      </Section>
    );
  }
}
