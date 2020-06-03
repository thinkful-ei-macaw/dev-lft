import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProjectDashService from '../ProjectDash/project-dash-service';

class ProjectDashVacancies extends Component {
  state = {
    vacancies: []
  };

  componentDidMount() {
    ProjectDashService.getVacancies(this.props.project_id)
      .then(response => {
        this.setState({ vacancies: response });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

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

  handleRequest = e => {
    e.preventDefault();
    let vacancy_id = e.target.value;
    let { requests, project_id } = this.props;

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

  renderVacancies = () => {
    let { vacancies } = this.state;
    let { user_role } = this.props;
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

  render() {
    return <ul className="vacancies">{this.renderVacancies()}</ul>;
  }
}
export default ProjectDashVacancies;
