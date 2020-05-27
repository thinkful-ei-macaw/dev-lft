import React, { Component } from 'react';
// import projectdashservice from './projectdashservice'
import './ProjectDash.css';
import { project, vacancies, requests } from './dummydata';

class ProjectDash extends Component {
  //user can be project_owner, team_member, or user
  state = {
    user_role: 'team_member',
    project,
    vacancies,
    requests
  };

  componentDidMount() {
    //wanna get all the project and request data here, store it in state, also get user role and store that as well
  }

  handleLeaveTeam = e => {
    e.preventDefault();
    console.log('leave');
  };

  handleRequest = e => {
    e.preventDefault();
    console.log('request');
  };

  handlePost = e => {
    e.preventDefault();
    let postBody = e.target['ProjectDash__create-post'].value;
    console.log(postBody);
  };

  handleApprove = e => {
    e.preventDefault();
    console.log('approve');
  };

  handleDecline = e => {
    e.preventDefault();
    console.log('decline');
  };

  handleNewMessage = e => {
    e.preventDefault();
    console.log('message');
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
        {user_role === 'user' ? (
          <button type="button" onClick={this.handleRequest}>
            Request to join
          </button>
        ) : (
          ''
        )}

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

/*

DONE--If a user is project creator, show pending requests to join
DONE--If a user is a project creator, show button/form to add vacancies
DONE--Pending requests have checkmark, X and a message icon. These can be used to approve, deny or message the requesting user.
DONE--If user is a project creator, shows a button (tiny) to delete a project. Require some kind of confirmation (are you sure that you're sure?)


DONE--Shows project info (title, desc, tags and all vacancies)

DONE--If a user is not part of a project, show a button to request to join

DONE--If a user is a part of a project, show project board
project board contains an input to create a post
DONE--If a user is a part of a project, show project links
DONE--If user is a project team member, shows a button (tiny) to leave a project. Confirm that you confirmed.


*/
