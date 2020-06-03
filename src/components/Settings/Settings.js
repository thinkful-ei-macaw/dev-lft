import React, { Component } from 'react';
import AuthApiService from '../../services/auth-api-service';
import UserContext from '../../contexts/UserContext';
import { Section, Input, Button } from '../Utils/Utils';
import './Settings.css';

export default class Settings extends Component {
  static contextType = UserContext;

  state = {
    updateSuccess: false,
    user: {},
    error: null
  };

  handleUpdate = event => {
    event.preventDefault();

    const {
      first_name,
      last_name,
      github_url,
      linkedin_url,
      twitter_url
    } = event.target;

    const updatedInfo = {
      first_name: first_name.value,
      last_name: last_name.value,
      github_url: github_url.value,
      linkedin_url: linkedin_url.value,
      twitter_url: twitter_url.value
    };

    AuthApiService.updateUserInfo(updatedInfo)
      .then(() => {
        this.setState({ updateSuccess: true });
        this.context.onProfileUpdate(updatedInfo);
      })
      .catch(error => error.error);
  };

  render() {
    const {
      first_name,
      last_name,
      github_url,
      linkedin_url,
      twitter_url
    } = this.context.user;

    return (
      <Section className="settingSection">
        <form className="settingForm" onSubmit={this.handleUpdate}>
          <h2>My profile </h2>
          {this.state.updateSuccess ? (
            <div className="updated">
              <i className="fas fa-check"></i> Your profile has been updated
            </div>
          ) : (
            ''
          )}
          <label htmlFor="first_name">First name:</label>
          <Input id="first_name" name="first_name" defaultValue={first_name} />
          <label htmlFor="last_name">Last name:</label>
          <Input id="last_name" name="last_name" defaultValue={last_name} />
          <label htmlFor="github_url">GitHub url:</label>
          <Input id="github_url" name="github_url" defaultValue={github_url} />
          <label htmlFor="linkedin_url">Linkedin url:</label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            defaultValue={linkedin_url}
          />
          <label htmlFor="twitter_url">Twitter url:</label>
          <Input
            id="twitter_url"
            name="twitter_url"
            defaultValue={twitter_url}
          />
          <Button className="update">Update</Button>
        </form>
      </Section>
    );
  }
}
