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
          <label htmlFor="name">Project name:</label>
          <Input type="text" name="name" id="name" required/>
          <label htmlFor="description">Description:</label>
          <Textarea name="description" id="description" rows="10" required/>
          <label htmlFor="tags">Tags:</label>
          <Input type="text" name="tags" required/>
          <label htmlFor="live_url">Live url:</label>
          <Input type="text" name="live_url" required/>
          <label htmlFor="trello_url">Trello url:</label>
          <Input type="text" name="trello_url" required/>
          <label htmlFor="live_url">GitHub url:</label>
          <Input type="text" name="github_url" required/>
          <Button className='submit'>Submit</Button>
          <Button className="cancel" onClick={e => {e.preventDefault(); this.props.history.push('/projects')}}>Cancel</Button>
        </form>
      </Section>
    )
  }
}
