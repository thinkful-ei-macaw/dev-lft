import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import ProjectDashService from './project-dash-service';
import Info from './Info';
import Posts from './Posts';
import ProjectLinks from './ProjectLinks';
import Vacancies from './Vacancies';
import OpenVacancies from './OpenVacancies';
import ChatModal from './ChatModal';
import Requests from './Requests';
import Button from '../Button/Button';
import './ProjectDash.css';

// images
import { CloseIcon, DotsIcon } from '../../images';

class ProjectDash extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    }
  };

  state = {
    userRole: '',
    project: {},
    vacancies: [],
    requests: [],
    showChatModal: false,
    error: null
  };

  async componentDidMount() {
    let project_handle = this.props.match.params.project_handle;

    this.setState({
      project_handle
    });

    try {
      const project = await ProjectDashService.getProject(project_handle);
      this.setState({ project });

      const requests = await ProjectDashService.getRequests(project.id);
      this.setState({ requests });

      const vacancies = await ProjectDashService.getVacancies(project.id);
      this.setState({ vacancies });

    } catch (res) {
      this.setState({ error: res.error });
    }
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
        'Are you really sure you want to delete this project??? Type "delete my project" to confirm'
      ) !== 'delete my project'
    ) {
      return;
    }

    let project_id = this.state.project.id;

    ProjectDashService.deleteProject(project_id)
      .then(() => {
        this.setState({
          project: []
        });
        this.props.history.push('/projects');
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleLeavePosition = (vacancy_id) => {
    if (
      prompt(
        'Are you sure you want to leave this position? Type "leave" to confirm'
      ) !== 'leave'
    ) {
      return;
    }

    let project_id = this.state.project.id;

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

  handleApprove = (request_id) => {
    let status = 'approved';
    let project_id = this.state.project.id;
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

  handleDecline = (request_id) => {
    let status = 'denied';
    let project_id = this.state.project.id;

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
    let { recipient_id } = this.state;
    let project_id = this.state.project.id;
    let body = e.target['chat-message'].value;
    ProjectDashService.postChat(project_id, recipient_id, body)
      .then(() => this.handleCloseChatModal())
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleOpenChatModal = (recipient_id) => {
    this.setState({
      showChatModal: true,
      recipient_id: recipient_id
    });
  };

  handleCloseChatModal = () => {
    this.setState({
      showChatModal: false,
      recipient_id: null
    });
  };

  dismissErrorMsg = () => {
    this.setState({
      error: null
    })
  }

  render() {
    let {
      project,
      project: { userRole },
      error,
    } = this.state;
    if (!project) {
      return <p>Could not find this project</p>;
    }
    return (
      <section className=" page project-dash">
        <Helmet>
          <title>{`${project.name || 'Project Dashboard'}`} - Dev LFT</title>
        </Helmet>

        <header>
          <div className="wrapper">
            <h2>{project.name}</h2>
            <Button className="clear"><DotsIcon /></Button>
          </div>
        </header>

        <div className="page-content">
          <div className="wrapper">
            {error
              ? (
                <div role="alert" className="info card error">
                  <p>{error}</p>
                  <Button className="clear" onClick={this.dismissErrorMsg}><CloseIcon /></Button>
                </div>
              )
              : ''}

            {userRole === 'member' || userRole === 'owner'
              ? <Posts project_id={this.state.project.id} />
              : ''}

            <div className="grid">
              <div className="column column-1-2">
                {userRole === 'owner'
                  ? (
                    <Requests
                      requests={this.state.requests}
                      handleDecline={this.handleDecline}
                      handleApprove={this.handleApprove}
                      handleOpenChatModal={this.handleOpenChatModal}
                      handleShowVacancyModal={this.handleShowVacancyModal}
                      handleDeleteProject={this.handleDeleteProject}
                    />
                  ) : ''}

                <Info
                  description={project.description}
                  tags={project.tags}
                />
              </div>

              <div className="column column-1-2">
                {userRole !== 'user' && (
                  <ProjectLinks
                    github={project.github_url}
                    live={project.live_url}
                    trello={project.trello_url}
                  />
                )}

                {this.state.project.id && (
                  <Vacancies
                    project_id={this.state.project.id}
                    userRole={userRole}
                    vacancies={this.state.vacancies}
                    setVacancies={this.setVacancies}
                    leavePosition={this.handleLeavePosition}
                  />
                )}
              </div>
            </div>

            <OpenVacancies
              setRequests={this.setRequests}
              setVacancies={this.setVacancies}
              handleApprove={this.handleApprove}
              vacancies={this.state.vacancies}
              requests={this.state.requests}
              project_id={this.state.project.id}
              userRole={userRole}
            />
          </div>
        </div>

        {userRole === 'owner' && this.state.showChatModal
          ? (
            <ChatModal
              handleNewMessage={this.handleNewMessage}
              handleCloseChatModal={this.handleCloseChatModal}
            />
          )
          : ''}

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
