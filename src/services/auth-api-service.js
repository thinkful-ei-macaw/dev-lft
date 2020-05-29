import config from '../config';
import TokenService from './token-service';

const AuthApiService = {
  postLogin({ username, password }) {
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getUserCount() {
    return fetch(`${config.API_ENDPOINT}/users`).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getUserInfo(user_id) {
    return fetch(`${config.API_ENDPOINT}/users/${user_id}`, {
      headers: {
        Authorization: `bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  updateUserInfo(
    user_id,
    first_name,
    last_name,
    github_url,
    linkedin_url,
    twitter_url
  ) {
    return fetch(`${config.API_ENDPOINT}/users/${user_id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        first_name,
        last_name,
        github_url,
        linkedin_url,
        twitter_url
      })
    }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res));
  }
};

export default AuthApiService;
