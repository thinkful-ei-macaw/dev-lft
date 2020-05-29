import React, { Component } from 'react';
import AuthApiService from '../../services/auth-api-service';
import TokenService from '../../services/token-service';
import { Section, Input, Button } from '../Utils/Utils';
import './Settings.css';

export default class Settings extends Component {
  state = {
    myInfo: [],
    updateSuccess: false
  };

  componentDidMount() {
    let user_id = TokenService.parseAuthToken().user_id;
    AuthApiService.getUserInfo(user_id).then(res => {
      this.setState({ myInfo: res });
    });
  }

  handleUpdate = event => {
    event.preventDefault();

    const {
      first_name,
      last_name,
      github_url,
      linkedin_url,
      twitter_url
    } = event.target;
    let user_id = TokenService.parseAuthToken().user_id;

    AuthApiService.updateUserInfo(
      user_id,
      first_name.value,
      last_name.value,
      github_url.value,
      linkedin_url.value,
      twitter_url.value
    )
      .then(() => {
        this.setState({ updateSuccess: true });
      })
      .catch(error => error.error);
  };

  render() {
    let myInfo = this.state.myInfo;
    return (
      <Section className="settingSection">
        <form className="settingForm" onSubmit={this.handleUpdate}>
          <h2>My profile </h2>
          {this.state.updateSuccess ? (
            <div className="updated">
              <i class="fas fa-check"></i> Your profile has been updated
            </div>
          ) : (
            ''
          )}
          <label htmlFor="first_name">First name:</label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={myInfo.first_name}
          />
          <label htmlFor="last_name">Last name:</label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={myInfo.last_name}
          />
          <label htmlFor="github_url">GitHub url:</label>
          <Input
            id="github_url"
            name="github_url"
            defaultValue={myInfo.github_url}
          />
          <label htmlFor="linkedin_url">Linkedin url:</label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            defaultValue={myInfo.linkedin_url}
          />
          <label htmlFor="twitter_url">Twitter url:</label>
          <Input
            id="twitter_url"
            name="twitter_url"
            defaultValue={myInfo.twitter_url}
          />
          <Button className="update">Update</Button>
        </form>
      </Section>
    );
  }
}
