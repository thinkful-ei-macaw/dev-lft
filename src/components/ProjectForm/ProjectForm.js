import React, { Component } from 'react'
import './ProjectForm.css';
import { Input, Textarea, Button, Section } from '../Utils/Utils';


export default class ProjectForm extends Component {

  handleSubmit = e => {
    e.preventDefault();
    // const { projectName, description, tags, links } = e.target;
    
    // // ProjectApiService.postProject(projectName.value, description.value, tags.value, links.value)
    // //   .then(this.context.addProject)
    // //   .then((project) => {
    // //     this.props.history.push(`/projects`)
    // //   })
    // //   .catch(this.context.setError)
  }


  render() {
    return (
      <Section className="projects-form">
        <form onSubmit={this.handleSubmit}>
          <h1>New Project</h1>
          <label htmlFor="project-name">Project name:</label>
          <Input type="text" name="projectName" id="projecName" required/>
          <label htmlFor="description">Description:</label>
          <Textarea name="description" id="description" rows="10" required/>
          <label htmlFor="tags">Tags:</label>
          <Input type="text" name="tags" required/>
          <label htmlFor="links">Links:</label>
          <Input type="text" name="links" required/>
          <Button className='submit'>Submit</Button>
          <Button className="cancel" onClick={e => {e.preventDefault(); this.props.history.push('/projects')}}>Cancel</Button>
        </form>
      </Section>
    )
  }
}
