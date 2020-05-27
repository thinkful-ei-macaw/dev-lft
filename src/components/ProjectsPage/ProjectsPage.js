import React, { Component } from 'react';
import './ProjectPage.css';
import { Button, Section } from '../Utils/Utils';


export default class ProjectsPage extends Component {
    // PostApiService.getMyProjects()
    // .then(this.context.setMyProjects)
    // .catch(this.context.setError)


  render() {
    // const myProjects = this.context.myProjects;

    return (
      <Section className="projects-page">
        <Button className="start-project" onClick={e => {e.preventDefault(); this.props.history.push('/project-form')}}>Create a new project</Button>
        <h2>Projects i'm involved in:</h2>
       {/* {myProjects.map(project => {
         <div>
           <h3>project.name</h3>
           <p>project.description</p>
           <p>project.tags</p>
           <p>project.links</p>
         </div>
       })} */}
      </Section>
    )
  }
}

