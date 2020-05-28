import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../Utils/Utils';
import ProjectApiService from '../../services/project-api-service';
import FeedItem from '../FeedItem/FeedItem';

export default class FeedPage extends Component {
  state = {
    vacancies: []
  }

  componentDidMount() {
    let project_id = this.props.match.params.project_id;
    ProjectApiService.getAllVacanciesForAProject(project_id)
      .then(vac => this.setState({vacancies: vac.vacancy}))
  }
  

  render() {    
    return (
      <Section className="projects-page">      
      <h2>Vacancies for this project:</h2> 
      <Link to="/projects">Go Back</Link>
      {
         (this.state.vacancies.length !== 0)? 
         <div>{this.state.vacancies.map((vacancy, i) => {
            return (<FeedItem key={i} vacancy={vacancy}/>)
         })}
         </div>
          : 'No vacancies available!'
         }         
      
    </Section>
    )
  }
}
