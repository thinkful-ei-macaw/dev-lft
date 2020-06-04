import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProjectDashService from './project-dash-service';

class Vacancies extends Component {
  static defaultProps = {
    vacancies: [],
    requests: []
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
    let { project_id } = this.props;
    ProjectDashService.patchVacancy(vacancy_id, user_id)
      .then(() => {
        ProjectDashService.getVacancies(project_id).then(vacancies => {
          this.props.setVacancies(vacancies);
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
          this.props.setVacancies(vacancies);
          this.props.setRequests(requests);
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
    let { vacancies } = this.props;
    const filtered = vacancies.filter(item => item.id != vacancy_id);
    ProjectDashService.deleteVacancy(vacancy_id)
      .then(() => {
        this.props.setVacancies(filtered);
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  renderVacancies = () => {
    let { userRole, vacancies } = this.props;
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
          {userRole === 'owner' && item.username !== null ? (
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
          {userRole === 'owner' && item.username === null ? (
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

          {userRole === 'user' && userRequest ? (
            <p>Request {userRequest.request_status}</p>
          ) : (
            ''
          )}

          {userRole === 'user' && item.username === null && !userRequest ? (
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
export default Vacancies;
