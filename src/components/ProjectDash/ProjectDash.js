import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import './ProjectDash.css';
import { project, vacancies, requests } from './dummydata';

class ProjectDash extends Component {
  //user can be project_owner, team_member, or user
  state = {
    user_role: 'owner',
    project,
    vacancies,
    requests,
    showChatModal: false
    // project_id
  };

  componentDidMount() {
    let project_id = 1;
    //get user role and store that as well
    ProjectDashService.getProjects(project_id).then(data => {
      this.setState({ project: data.project });
    });
    ProjectDashService.getRequests(project_id).then(res => {
      this.setState({ requests: res });
    });
    ProjectDashService.getVacancies(project_id).then(response => {
      this.setState({ vacancies: response });
    });
    // ProjectDashService.getPosts(project_id)
  }

  handleDeleteProject = e => {
    e.preventDefault();
    let project_id = 1;
    ProjectDashService.deleteProject(project_id)
      .then
      //history.push('/feed')
      ();
  };

  handleShowVacancyModal = e => {
    this.setState({
      showVacancyModal: true
    });
  };

  handleCloseVacancyModal = () => {
    let project_id = 1;
    ProjectDashService.getVacancies(project_id).then(response => {
      this.setState({
        vacancies: response,
        showVacancyModal: false
      });
    });
  };

  renderVacancyModal = e => {
    return (
      <form onSubmit={this.handleSubmitVacancy} name="add-vacancy-form">
        <label htmlFor="vacancy-title">Role:</label>
        <input name="vacancy-title" id="vacancy-title" />
        <label htmlFor="vacancy-description">Description:</label>
        <input name="vacancy-description" id="vacancy-description" />
        <label htmlFor="vacancy-skills">Skills:</label>
        <p>Add a comma after each skill. example: React, CSS</p>
        <input name="vacancy-skills" id="vacancy-skills" />
        <button type="submit">Submit</button>
        <button onClick={this.handleCloseVacancyModal} type="button">
          Cancel
        </button>
      </form>
    );
  };

  handleSubmitVacancy = e => {
    e.preventDefault();
    let project_id = 1;
    let title = e.target['vacancy-title'].value;
    let description = e.target['vacancy-description'].value;
    let skills = e.target['vacancy-skills'].value.split(',');
    ProjectDashService.postVacancies(
      title,
      description,
      skills,
      project_id
    ).then(res => (res ? this.handleCloseVacancyModal() : ''));
    //need to add error handling
  };

  handleDeleteVacancy = e => {
    e.preventDefault();
    let vacancy_id = e.target.value;
    const { vacancies: prevGuides } = this.state;
    const filtered = prevGuides.filter(item => item.id != vacancy_id);
    ProjectDashService.deleteVacancy(vacancy_id).then(
      this.setState({
        vacancies: filtered
      })
    );
  };

  handleLeaveTeam = e => {
    e.preventDefault();
    //patch to vacancies
    //user_id changes to null
    //let user_id = null;
    //ProjectDashService.patchVacancy(vacancy_id, user_id)
    console.log('leave');
  };

  //need to add some sort of user feedback
  handleRequest = e => {
    e.preventDefault();
    let project_id = 1;
    let vacancy_id = e.target.value;
    ProjectDashService.postRequest(project_id, vacancy_id);
  };

  handleSubmitPost = e => {
    e.preventDefault();
    let message = e.target['ProjectDash__create-post'].value;
    //ProjectDashService.postPost(message, project_id)
    console.log(message);
  };

 //need to rerender the vacancies
  handleApprove = e => {
    e.preventDefault();
    let request_id = e.target.value;
    let status = 'approved';
    let {requests} = this.state
    let newR = requests.map(item => {
      if (item.id == request_id) {
        item.status = status
        return item
      }
      else {
        return item
      }
    })
    ProjectDashService.patchRequest(status, request_id).then(
      this.setState({
        requests: newR
      })
    );
  };

  handleDecline = e => {
    e.preventDefault();
    let request_id = e.target.value;
    let status = 'denied';
    let {requests} = this.state
    let newR = requests.map(item => {
      if (item.id == request_id) {
        item.status = status
        return item
      }
      else {
        return item
      }
    })
    ProjectDashService.patchRequest(status, request_id).then(
      this.setState({
        requests: newR
      })
    );
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

  //in progess
  handleRemoveMember = e => {
    e.preventDefault();
    let vacancy_id = e.target.value;
    let user_id = null;
    let { vacancies } = this.state;
    let newV = vacancies.map(item => {
      if (item.id == vacancy_id) {
        item.user_id = null;
        return item;
      } else {
        return item;
      }
    });
    ProjectDashService.patchVacancy(vacancy_id, user_id).then(
      this.setState({
        vacancies: newV
      })
    );
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
          <p>{item.user_id === null ? 'This role is available' : ''}</p>
          <p>Role: {item.title}</p>
          <p>Duties: {item.description}</p>
          <p>Skills: {item.skills.join(', ')}</p>
          {user_role === 'owner' && item.user_id !== null ? (
            <button
              value={item.id}
              onClick={this.handleRemoveMember}
              type="button"
            >
              Remove member
            </button>
          ) : (
            ''
          )}
          {user_role === 'owner' && item.user_id === null ? (
            <button
              value={item.id}
              onClick={this.handleDeleteVacancy}
              type="button"
            >
              Delete Vacancy
            </button>
          ) : (
            ''
          )}
          {user_role === 'user' && item.user_id === null ? (
            <button type="button" value={item.id} onClick={this.handleRequest}>
              Request to join
            </button>
          ) : (
            ''
          )}
        </li>
      );
    });

    let pendingRequests = requests.filter(request => {
      return request.status === 'pending';
    });
    let requestList = pendingRequests.map(request => {
      return (
        <li key={request.id}>
          {request.name} wants to join your team
          <button value={request.id} onClick={this.handleDecline} type="button">
            Decline
          </button>
          <button value={request.id} onClick={this.handleApprove} type="button">
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
              onSubmit={this.handleSubmitPost}
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
            <button onClick={this.handleShowVacancyModal} type="button">
              Add new vacancy
            </button>
            <button onClick={this.handleDeleteProject} type="button">
              Delete this project
            </button>
          </article>
        ) : (
          ''
        )}
        {this.state.showVacancyModal ? this.renderVacancyModal() : ''}
      </section>
    );
  }
}

export default ProjectDash;
