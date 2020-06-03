import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import './ProjectDash.css';
import TokenService from '../../services/token-service';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProjectDash extends Component {
  static defaultProps = {
    history: {
      push: () => {}
    }
  };

  state = {
    user_role: '',
    project: {},
    vacancies: [],
    requests: [],
    posts: [],
    showChatModal: false
  };

  componentDidMount() {
    let project_id = this.props.match.params.project_id;

    this.setState({
      project_id
    });

    ProjectDashService.getProjects(project_id)
      .then(project => {
        this.setState({ project });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });

    ProjectDashService.getRequests(project_id)
      .then(res => {
        this.setState({ requests: res });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });

    ProjectDashService.getVacancies(project_id)
      .then(response => {
        this.setState({ vacancies: response });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });

    ProjectDashService.getPosts(project_id)
      .then(posts => {
        this.setState({ posts });
      })
      .then(() => {
        this.determineUserRole();
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  determineUserRole = () => {
    let { project, vacancies } = this.state;
    let isMember = vacancies.find(item => item.request_status == 'approved');
    if (project.isOwner) {
      this.setState({
        user_role: 'owner'
      });
    } else if (isMember !== undefined) {
      this.setState({
        user_role: 'team_member'
      });
    } else {
      this.setState({
        user_role: 'user'
      });
    }
  };

  handleDeleteProject = e => {
    e.preventDefault();
    if (
      prompt(
        'Are you really sure you want to delete this project??? Type "delete my project" to confirm '
      ) !== 'delete my project'
    ) {
      return;
    }
    let { project_id } = this.state;

    ProjectDashService.deleteProject(project_id)
      .then(() => {
        this.setState({
          project: []
        });
        this.props.history.push('/my-projects');
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleShowVacancyModal = e => {
    this.setState({
      showVacancyModal: true
    });
  };

  handleCloseVacancyModal = () => {
    let { project_id } = this.state;

    ProjectDashService.getVacancies(project_id)
      .then(response => {
        this.setState({
          vacancies: response,
          showVacancyModal: false
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
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
    let { project_id } = this.state;

    let title = e.target['vacancy-title'].value;
    let description = e.target['vacancy-description'].value;
    let skills = e.target['vacancy-skills'].value.split(',');
    ProjectDashService.postVacancies(title, description, skills, project_id)
      .then(res => (res ? this.handleCloseVacancyModal() : ''))
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleDeleteVacancy = e => {
    e.preventDefault();
    if (
      prompt(
        'Are you sure you want to delete this vacancy? Type "delete" to confirm '
      ) !== 'delete'
    ) {
      return;
    }
    let vacancy_id = e.target.value;
    const { vacancies: prevGuides } = this.state;
    const filtered = prevGuides.filter(item => item.id != vacancy_id);
    ProjectDashService.deleteVacancy(vacancy_id)
      .then(
        this.setState({
          vacancies: filtered
        })
      )
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleLeaveTeam = e => {
    e.preventDefault();
    if (
      prompt(
        'Are you sure you want to leave this team? Type "leave" to confirm '
      ) !== 'leave'
    ) {
      return;
    }
    let { vacancies, project_id } = this.state;
    let vacancy = vacancies.find(item => item.request_status === 'approved');
    let vacancy_id = vacancy.id;
    //set user_id to null to update server
    let user_id = null;
    ProjectDashService.patchVacancy(vacancy_id, user_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.setState({
            vacancies,
            user_role: 'user'
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleRequest = e => {
    e.preventDefault();
    let vacancy_id = e.target.value;
    let { project_id, requests } = this.state;

    ProjectDashService.postRequest(vacancy_id)
      .then(res => {
        requests.push(res);
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.setState({
            requests,
            vacancies
          });
        });
      })
      .catch(res => {
        this.setState({
          error: res.error
        });
      });
  };

  handleSubmitPost = e => {
    e.preventDefault();
    let { project_id } = this.state;
    let message = e.target['create-post'].value;
    document.getElementById('post-to-project-form').reset();

    ProjectDashService.postPost(project_id, message)
      .then(() => {
        ProjectDashService.getPosts(project_id).then(posts => {
          this.setState({
            posts
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleApprove = e => {
    e.preventDefault();
    let request_id = e.target.value;
    let status = 'approved';
    let { project_id } = this.state;
    ProjectDashService.patchRequest(status, request_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.setState({
            vacancies
          });
        });
      })
      .then(() => {
        ProjectDashService.getRequests(project_id).then(requests => {
          this.setState({
            requests
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleDecline = e => {
    e.preventDefault();
    let request_id = e.target.value;
    let status = 'denied';
    let { project_id } = this.state;

    ProjectDashService.patchRequest(status, request_id)
      .then(() => {
        ProjectDashService.getRequests(project_id).then(requests => {
          this.setState({
            requests
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleNewMessage = e => {
    e.preventDefault();
    let { recipient_id, project_id } = this.state;
    let body = e.target['chat-message'].value;
    ProjectDashService.postChat(project_id, recipient_id, body)
      .then(() => this.handleCloseChatModal())
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleOpenChatModal = e => {
    this.setState({
      showChatModal: true,
      recipient_id: e.target.value
    });
  };

  handleCloseChatModal = e => {
    this.setState({
      showChatModal: false,
      recipient_id: null
    });
  };

  handleEditPost = e => {
    e.preventDefault();
    let post_id = e.target.value;
    this.setState({
      postToEdit: post_id
    });
  };

  handlePatchPost = e => {
    e.preventDefault();
    let { project_id } = this.state;
    let post_id = this.state.postToEdit;
    let message = e.target['edit-post'].value;

    ProjectDashService.patchPost(post_id, message)
      .then(() => {
        ProjectDashService.getPosts(project_id).then(posts => {
          this.setState({
            posts,
            postToEdit: null
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleCancelEdit = () => {
    this.setState({
      postToEdit: null
    });
  };

  handleRemoveMember = e => {
    e.preventDefault();
    if (
      prompt(
        'Are you sure you want to remove this member? Type "remove" to confirm '
      ) !== 'remove'
    ) {
      return;
    }
    let vacancy_id = e.target.value;
    let user_id = null;
    let { project_id } = this.state;
    ProjectDashService.patchVacancy(vacancy_id, user_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.setState({
            vacancies
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  renderChatModal = () => {
    return (
      <div className="chat-modal">
        <form onSubmit={this.handleNewMessage} className="start-chat-form">
          <label htmlFor="chat-message">What's the message?</label>
          <input type="text" name="chat-message" id="chat-message" />
          <button type="submit">Send</button>
          <button onClick={this.handleCloseChatModal} type="button">
            Cancel
          </button>
        </form>
      </div>
    );
  };

  renderTags = () => {
    let { project } = this.state;
    if (!project) {
      return;
    } else if (project.tags) {
      let tagsList = project.tags.map(tag => {
        return <li key={tag}>{tag}</li>;
      });
      return tagsList;
    }
  };

  renderVacancies = () => {
    let { vacancies, user_role } = this.state;
    if (!vacancies) {
      return <p>No vacancies at this time</p>;
    }
    let userRequests = vacancies.filter(item => item.request_status !== null);

    let vacancyList = vacancies.map(item => {
      let userRequest = userRequests.find(req => req.id == item.id) || null;
      return (
        <li key={item.id}>
          <h3>
            {item.username !== null ? (
              <Link to={`/users/${item.username}`}>
                <span>
                  {item.first_name} {item.last_name}
                </span>
              </Link>
            ) : (
              <span>This role is available</span>
            )}
          </h3>
          <p>Role: {item.title}</p>
          <p>Duties: {item.description}</p>
          <p>Skills: {item.skills.join(', ')}</p>
          {user_role === 'owner' && item.username !== null ? (
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
          {user_role === 'owner' && item.username === null ? (
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

          {user_role === 'user' && userRequest ? (
            <p>Request {userRequest.request_status}</p>
          ) : (
            ''
          )}

          {user_role === 'user' && item.username === null && !userRequest ? (
            <button type="button" value={item.id} onClick={this.handleRequest}>
              Request to join
            </button>
          ) : (
            ''
          )}
        </li>
      );
    });
    return vacancyList;
  };

  renderPosts = () => {
    let { posts, postToEdit } = this.state;
    if (!posts) {
      return <p>No posts at this time</p>;
    }

    let allPosts = posts.map(post => {
      return (
        <li key={post.id}>
          <p>
            {post.first_name} {post.last_name}: {post.message}
          </p>
          {post.canEdit ? (
            <button value={post.id} onClick={this.handleEditPost} type="button">
              edit
            </button>
          ) : (
            ''
          )}
          {post.canEdit && postToEdit == post.id ? (
            <form
              name="edit-post-form"
              className="edit-post-form"
              onSubmit={this.handlePatchPost}
            >
              <label htmlFor="edit-post">Change to:</label>
              <input type="text" name="edit-post" id="edit-post" />
              <button type="submit">Submit</button>
              <button onClick={this.handleCancelEdit} type="button">
                Cancel
              </button>
            </form>
          ) : (
            ''
          )}
        </li>
      );
    });
    return allPosts;
  };

  renderRequests = () => {
    let { requests } = this.state;
    let pendingRequests = requests.filter(item => item.status === 'pending');
    if (!requests) {
      return <p>No requests at this time</p>;
    }

    let requestList = pendingRequests.map(request => {
      return (
        <li key={request.id}>
          <Link to={`/users/${request.username}`}>
            {request.first_name} {request.last_name}
          </Link>
          wants to fill your {request.vacancy_title} role
          <button value={request.id} onClick={this.handleDecline} type="button">
            Decline
          </button>
          <button value={request.id} onClick={this.handleApprove} type="button">
            Approve
          </button>
          <button
            value={request.user_id}
            onClick={this.handleOpenChatModal}
            type="button"
          >
            Message
          </button>
        </li>
      );
    });

    return requestList;
  };

  render() {
    let { project, user_role, error } = this.state;
    if (!project) {
      return <p>Could not find this project</p>;
    }
    return (
      <section className="ProjectDash">
        <div role="alert">{error && <p>{error}</p>}</div>
        <h1>Project Dashboard</h1>
        <article className="project">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <ul className="tags">{this.renderTags()}</ul>
          <ul className="vacancies">{this.renderVacancies()}</ul>
        </article>

        {user_role === 'team_member' || user_role === 'owner' ? (
          <article className="team-options">
            <div className="team-posts">
              <ul>{this.renderPosts()}</ul>
            </div>

            <a
              className="links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.github.com"
            >
              Github
            </a>
            <a
              className="links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.github.com"
            >
              Live Page
            </a>
            <a
              className="links"
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.trello.com"
            >
              Trello
            </a>

            <form onSubmit={this.handleSubmitPost} id="post-to-project-form">
              <label htmlFor="create-post">What do you want to post?</label>
              <input name="create-post" id="create-post" type="text" required />
              <button type="submit">Submit Post</button>
            </form>
          </article>
        ) : (
          ''
        )}

        {user_role === 'team_member' ? (
          <button onClick={this.handleLeaveTeam} type="button">
            Leave Team
          </button>
        ) : (
          ''
        )}

        {user_role === 'owner' ? (
          <article className="creator-options">
            <div className="pending-requests">
              <ul className="request">{this.renderRequests()}</ul>
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
        {user_role === 'owner' && this.state.showChatModal
          ? this.renderChatModal()
          : ''}
        {this.state.showVacancyModal ? this.renderVacancyModal() : ''}
      </section>
    );
  }
}

ProjectDash.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      folder_id: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default ProjectDash;
