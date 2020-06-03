import React, { Component } from 'react';
import AuthApiService from '../../services/auth-api-service';
import { Section } from '../Utils/Utils';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export default class UserProfile extends Component {
  state = {
    loading: false,
    error: null
  };

  componentDidMount() {
    this.setState({ loading: true });
    let username = this.props.match.params.username;
    AuthApiService.getUserInfo(username)
      .then(userInfo => {
        this.setState({ ...userInfo, loading: false });
      })
      .catch(error => this.setState({ ...error, loading: false }));
  }

  getDate = date => {
    const activeDate = new Date(date);
    return format(activeDate, 'MMM yyy');
  };

  render() {
    const {
      error,
      loading,
      first_name,
      last_name,
      date_created,
      github_url,
      linkedin_url,
      twitter_url
    } = this.state;
    return (
      <Section>
        <div role="alert">{error && <p>{error}</p>}</div>
        {!loading && !error && (
          <div>
            <h2>{first_name}'s profile</h2>
            <p>
              {first_name} {last_name} | Active since{' '}
              {date_created ? this.getDate(date_created) : null}
            </p>
            <p>GitHub: {github_url ? github_url : 'N/A'}</p>
            <p>Linkedin: {linkedin_url ? linkedin_url : 'N/A'}</p>
            <p>Twitter: {twitter_url ? twitter_url : 'NA'}</p>
          </div>
        )}
      </Section>
    );
  }
}

UserProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};
