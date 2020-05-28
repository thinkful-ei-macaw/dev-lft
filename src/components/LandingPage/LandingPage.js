import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProjectApiService from '../../services/project-api-service';
import AuthApiService from '../../services/auth-api-service';
import Carousel from '../Carousel/Carousel';
import './LandingPage.css';

export default class LandingPage extends Component {
  state = {
    projects: [],
    userCount: 11000
  }

  componentDidMount() {
    // get projects
    ProjectApiService.getAllProjects()
      .then(projects => {

        // get user count, since we're already making calls yeah?
        AuthApiService.getUserCount()
          .then(({ count }) => {
            this.setState({
              projects: projects.slice(0, 3),
              userCount: count
            });
          })
          .catch(console.error)

      })
      .catch(console.error)
  }

  render() {
    const { projects, userCount } = this.state;
    const formattedUserCount = new Intl.NumberFormat().format(userCount);
    return (
      <main className="landing-page">
        <section className="hero">
          <h1>Side Projects <i>Conquered.</i></h1>
          <p>Lorem ipsum something something something something something</p>
          <Link to="/signup" className="cta">Start Yours</Link>
        </section>

        <section className="wrapper features">
          <article>
            <img src="https://picsum.photos/760/360?random=1" alt="build a team" />
            <h2>Build a team</h2>
            <p>Lorem ipsum something something something something something</p>
          </article>

          <article>
            <img src="https://picsum.photos/760/360?random=2" alt="build a team" />
            <h2>Join a team</h2>
            <p>Lorem ipsum something something something something something</p>
          </article>

          <article>
            <img src="https://picsum.photos/760/360?random=3" alt="build a team" />
            <h2>Bring your tools</h2>
            <p>Lorem ipsum something something something something something</p>
          </article>
        </section>

        <section className="wrapper projects">
          <h2>Projects that could use someone like you</h2>
          <Carousel>
            {projects.map(project => (
              <article key={project.id} className="project slide">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </article>
            ))}
          </Carousel>
          <Link to="/signup" className="cta">Sign up to join this team</Link>
        </section>

        <section className="push">
          <h2>What are you waiting for?</h2>
          <p>{formattedUserCount}+ users are using Dev LFT to crush their side projects.</p>
          <Link to="/signup" className="cta">Get #LFTed</Link>
        </section>
      </main>
    );
  }
}
