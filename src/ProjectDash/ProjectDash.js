import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import './ProjectDash.css';
import { project, vacancies, requests } from './dummydata';

class ProjectDash extends Component {
  //user can be project_owner, team_member, or user
  state = {
    user_role: 'team_member',
    project,
    vacancies,
    requests,
    showChatModal: false
    // project_id
  };

  componentDidMount() {
    let project_id = 2;
    //get user role and store that as well
    ProjectDashService.getProjects(project_id).then(data => {
      this.setState({ project: data.project });
    });
    // ProjectDashService.getRequests(project_id)
    // ProjectDashService.getVacancies(project_id)
    // ProjectDashService.getPosts(project_id)
  }

  handleLeaveTeam = e => {
    e.preventDefault();
    //patch to vacancies
    //user_id changes to null
    let user_id = null;
    //ProjectDashService.patchVacancies(vacancy_id, project_id, user_id)
    console.log('leave');
  };

  handleRequest = e => {
    e.preventDefault();
    //post to requests
    console.log('request');
  };

  handlePost = e => {
    e.preventDefault();
    let message = e.target['ProjectDash__create-post'].value;
    //ProjectDashService.postPost(message, project_id)
    console.log(message);
  };

  handleApprove = e => {
    e.preventDefault();
    //patch to vacancies
    //delete/patch to request
    console.log('approve');
  };

  handleDecline = e => {
    e.preventDefault();
    //delete/patch to request
    console.log('decline');
  };

  handleNewMessage = e => {
    e.preventDefault();
    //open modal, send post request, close modal
    this.handleCloseChatModal();
    console.log('message');
  };

  handleOpenChatModal = e => {
    this.setState({
      showChatModal: true
    });
    this.renderChatModal();
  };

  handleCloseChatModal = e => {
    this.setState({
      showChatModal: false
    });
  };

  renderChatModal = () => {
    return (
      <div className="ProjectDash__chat-modal">
        <form
          onSubmit={this.handleNewMessage}
          className="ProjectDash__start-chat-form"
        >
          <label htmlFor="ProjectDash__chat-message">What's the message?</label>
          <input
            type="text"
            name="ProjectDash__chat-message"
            id="ProjectDash__chat-message"
          />
          <button type="submit">Send</button>
          <button onClick={this.handleCloseChatModal} type="button">
            Cancel
          </button>
        </form>
      </div>
    );
  };

  render() {
    let { project, vacancies, requests, user_role } = this.state;

    let tagsList = project.tags.map(tag => {
      return <li key={tag}>{tag}</li>;
    });

    let vacancyList = vacancies.map(item => {
      return (
        <li key={item.id}>
          <p>
            {item.user_id === null ? 'This role is available' : item.user_id}
          </p>
          <p>Role: {item.title}</p>
          <p>Duties: {item.description}</p>
          <p>Skills: {item.skills.join(', ')}</p>
          {user_role === 'user' && item.user_id === null ? (
            <button type="button" onClick={this.handleRequest}>
              Request to join
            </button>
          ) : (
            ''
          )}
        </li>
      );
    });

    let requestList = requests.map(request => {
      return (
        <li key={request.id}>
          {request.name} wants to join your team
          <button onClick={this.handleDecline} type="button">
            Decline
          </button>
          <button onClick={this.handleApprove} type="button">
            Approve
          </button>
          <button onClick={this.handleNewMessage} type="button">
            Message
          </button>
        </li>
      );
    });

    return (
      <section className="ProjectDash">
        <h1>Project Dashboard</h1>
        <article className="ProjectDash__project">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <ul className="ProjectDash__tags">{tagsList}</ul>
          <ul className="ProjectDash__vacancies">{vacancyList}</ul>
        </article>

        {user_role === 'team_member' ? (
          <article className="ProjectDash__team-options">
            <a
              className="ProjectDash__links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.github.com"
            >
              Github
            </a>
            <a
              className="ProjectDash__links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.github.com"
            >
              Live Page
            </a>
            <a
              className="ProjectDash__links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.trello.com"
            >
              Trello
            </a>

            <form
              onSubmit={this.handlePost}
              className="ProjectDash__post-to-project"
            >
              <label htmlFor="ProjectDash__create-post">
                What do you want to post?
              </label>
              <input
                name="ProjectDash__create-post"
                id="ProjectDash__create-post"
                type="text"
                required
              />
              <button type="submit">Submit Post</button>
            </form>
            <button onClick={this.handleLeaveTeam} type="button">
              Leave Team
            </button>
          </article>
        ) : (
          ''
        )}

        {user_role === 'owner' ? (
          <article className="ProjectDash__creator-options">
            <div className="ProjectDash__pending-requests">
              <ul className="ProjectDash__request">{requestList}</ul>
            </div>
            <button type="button">Add new vacancy</button>
            <button type="button">Delete this project</button>
          </article>
        ) : (
          ''
        )}
      </section>
    );
  }
}

export default ProjectDash;
