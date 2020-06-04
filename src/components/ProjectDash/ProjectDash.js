import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import Info from './Info';
import Posts from './Posts';
import Vacancies from './Vacancies';
import VacancyModal from './VacancyModal';
import ChatModal from './ChatModal';
import Requests from './Requests';
import './ProjectDash.css';
import PropTypes from 'prop-types';

class ProjectDash extends Component {
  static defaultProps = {
    history: {
      push: () => {}
    }
  };

  state = {
    userRole: '',
    project: {},
    vacancies: [],
    requests: [],
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
  }

  // Here be props, we must call back
  setVacancies = vacancies => {
    this.setState({ vacancies });
  };
  setRequests = requests => {
    this.setState({ requests });
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
            userRole: 'user'
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

  render() {
    let {
      project,
      project: { userRole },
      error
    } = this.state;
    if (!project) {
      return <p>Could not find this project</p>;
    }
    return (
      <section className="ProjectDash">
        <div role="alert">{error && <p>{error}</p>}</div>
        <h1>Project Dashboard</h1>
        <article className="project">
          <Info
            name={project.name}
            description={project.description}
            tags={project.tags}
          />
          {this.state.project_id && (
            <Vacancies
              project_id={this.state.project_id}
              userRole={userRole}
              vacancies={this.state.vacancies}
              requests={this.state.requests}
              setVacancies={this.setVacancies}
              setRequests={this.setRequests}
            />
          )}
        </article>

        {userRole === 'member' || userRole === 'owner' ? (
          /*  Passing the whole project so that the ProjectLinks can render.
              TODO: Find out if these are going to move into this component.
              Looks like it was done for the current layout where it's between
              Posts and Project Links.
          */
          <Posts project_id={this.state.project_id} project={project} />
        ) : (
          ''
        )}

        {userRole === 'member' ? (
          <button onClick={this.handleLeaveTeam} type="button">
            Leave Team
          </button>
        ) : (
          ''
        )}

        {userRole === 'owner' ? (
          <Requests
            requests={this.state.requests}
            handleDecline={this.handleDecline}
            handleApprove={this.handleApprove}
            handleOpenChatModal={this.handleOpenChatModal}
            handleShowVacancyModal={this.handleShowVacancyModal}
            handleDeleteProject={this.handleDeleteProject}
          />
        ) : (
          ''
        )}
        {userRole === 'owner' && this.state.showChatModal ? (
          <ChatModal
            handleNewMessage={this.handleNewMessage}
            handleCloseChatModal={this.handleCloseChatModal}
          />
        ) : (
          ''
        )}
        {this.state.showVacancyModal ? (
          <VacancyModal
            handleSubmitVacancy={this.handleSubmitVacancy}
            handleCloseVacancyModal={this.handleCloseVacancyModal}
          />
        ) : (
          ''
        )}
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
