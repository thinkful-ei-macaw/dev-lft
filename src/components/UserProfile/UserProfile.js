import React, { Component } from 'react';
import AuthApiService from '../../services/auth-api-service';
import TokenService from '../../services/token-service';
import { Section } from '../Utils/Utils';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

export default class UserProfile extends Component {
  state = {
    userInfo: []
  };
  componentDidMount() {
    let user_id = this.props.match.params.user_id;
    AuthApiService.getUserInfo(user_id).then(res => {
      this.setState({ userInfo: res });
    });
  }

  getDate(date) {
    return moment(date).format('MMM YYYY');
  }
  render() {
    let userInfo = this.state.userInfo;
    console.log(userInfo.date_created);
    return (
      <Section>
        {userInfo.user_id === TokenService.parseAuthToken().user_id ? (
          <Redirect to="/settings" />
        ) : (
          <div>
            <h2>{userInfo.first_name}'s profile</h2>
            <p>
              {userInfo.first_name} {userInfo.last_name} | Active since{' '}
              {this.getDate(userInfo.date_created)}
            </p>
            <p>GitHub: {userInfo.github_url ? userInfo.github_url : 'N/A'}</p>
            <p>
              Linkedin: {userInfo.linkedin_url ? userInfo.linkedin_url : 'N/A'}
            </p>
            <p>Twitter: {userInfo.twitter_url ? userInfo.twitter_url : 'NA'}</p>
          </div>
        )}
      </Section>
    );
  }
}
