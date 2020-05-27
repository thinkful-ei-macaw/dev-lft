import React, { Component } from 'react';
import { Section } from '../Utils/Utils';

export default class FeedPage extends Component {

  //  ProjectApiService.getVacancies()
  //     .then(this.context.setVacancies)
  //     .catch(this.context.setError)

  render() {
    // const vacancies = this.context.vacancies;

    return (
      <Section className="vacancy">
        <h1>All Projects With Vacancies</h1>
        <ul className="vacanciesList">
        {/* {
          vacancies.map(vacancy => {
            <li>{vacancy}</li>
          })
        } */}
        <li className="clickable">Test Vacancy1</li>
        <li className="clickable">Test Vacancy1</li>
        <li className="clickable">Test Vacancy1</li>
        <li className="clickable">Test Vacancy1</li>
        </ul>
      </Section>
    )
  }
}
