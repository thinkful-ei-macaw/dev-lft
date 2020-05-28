import React, { Component } from 'react';
import ProjectApiService from '../../services/project-api-service';
import './ProjectForm.css';
import { Input, Textarea, Button, Section } from '../Utils/Utils';


export default class ProjectForm extends Component {

  handleSubmit = e => {
    e.preventDefault();
    const { name, description, live_url, trello_url, github_url } = e.target;
    const tags = e.target.tags.value.split(', ');
    ProjectApiService.postProject(name.value, description.value, tags, live_url.value, trello_url.value, github_url.value)
      .then(() => {
        this.props.history.push(`/projects`)
      })
      .catch(error => {
        console.log(error);
      })
  }


  render() {
    return (
      <Section className="projects-form">
        <form onSubmit={this.handleSubmit} className="projectSubmitForm">
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
          <Button className="cancel" onClick={e => {e.preventDefault(); this.props.history.push('/my-projects')}}>Cancel</Button>
        </form>
      </Section>
    )
  }
}
