import React, { Component } from 'react';

class OpenVacancies extends Component {
  static defaultProps = {
    vacancies: [],
    project_id: null,
    userRole: ''
  };

  renderOpenVacancies = () => {
    let allVacancies = this.props.vacancies;
    let openVacancies = allVacancies.filter(item => item.username === null);

    return openVacancies.map(item => {
      return (
        <li className="open-vacancies-item" key={item.id}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <ul className="vacancy-skills">{this.renderSkills(item.skills)}</ul>
        </li>
      );
    });
  };

  renderSkills = skills => {
    return skills.map(element => {
      return <li key={element}>{element}</li>;
    });
  };

  render() {
    return (
      <article className="open-vacancies">
        <h3>Open Positions</h3>
        <ul className="open-vacancies-list">{this.renderOpenVacancies()}</ul>
        <button onClick={this.props.handleRequest} type="button">
          Request to Join
        </button>
      </article>
    );
  }
}

export default OpenVacancies;
