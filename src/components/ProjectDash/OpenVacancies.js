import React, { Component } from 'react';
import Button from '../Button/Button';
import ProjectDashService from './project-dash-service';

class OpenVacancies extends Component {
  static defaultProps = {
    vacancies: [],
    requests: [],
    project_id: null
  };

  handleRequest = (vacancy_id, callback = () => null) => {
    let { requests, project_id } = this.props;

    ProjectDashService.postRequest(vacancy_id)
      .then(res => {
        callback(res.id);
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

  renderOpenVacancies = () => {
    let { vacancies, userRole, handleApprove } = this.props;
    let openVacancies = vacancies.filter(item => item.username === null);
    let userRequests = vacancies.filter(item => item.request_status !== null);

    return (
      <>
        {
          openVacancies.length
            ? <ul className="open-vacancies-list">
              {openVacancies.map(item => {
                let userRequest = userRequests.find(req => req.id === item.id) || null;
                return (
                  <li className="project" key={item.id}>
                    <div className="project-left">
                      <h4 className="h3">{item.title}</h4>
                      <p className="description">{item.description}</p>
                    </div>
                    <div className="project-right">
                      <ul className="tags">{this.renderSkills(item.skills)}</ul>
                      <div>
                        <Button
                          className={userRequest ? 'clear' : ''}
                          disabled={!!userRequest}
                          onClick={() => !userRequest && userRole === 'owner'
                            ? this.handleRequest(item.id, handleApprove)
                            : this.handleRequest(item.id)
                          }
                        >
                          {userRequest
                            ? `Request ${userRequest.request_status}`
                            : userRole === 'owner'
                              ? 'Fill this position'
                              : 'Request to join'}
                        </Button>
                      </div>

                    </div>
                  </li>
                );
              })}
            </ul>
            : <p className="project">No open positions at this time.</p>
        }
      </>
    );
  };

  renderSkills = skills => {
    return skills.map(element => {
      return <li className="tag tag-grey" key={element}>{element}</li>;
    });
  };

  render() {
    return (
      <article className="card">
        <h3 className="title">Open Positions</h3>
        {this.renderOpenVacancies()}
      </article>
    );
  }
}

export default OpenVacancies;
