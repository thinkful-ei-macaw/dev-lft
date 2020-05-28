import config from '../config';
import TokenService from '../services/token-service';

const ProjectDashService = {
  getProjects(project_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/projects/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getVacancies(project_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/vacancies/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getRequests(project_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/requests/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getPosts(project_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/posts/${project_id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postVacancies(title, description, skills, project_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/vacancies/${project_id}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ title, description, skills })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  patchVacancies(vacancy_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/vacancies/${vacancy_id}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ vacancy_id})
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postRequest(project_id, vacancy_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/requests/${vacancy_id}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ project_id})
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  patchRequest(status, request_id) {
    return fetch(`${config.REACT_APP_API_ENDPOINT}/requests/${request_id}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ status })
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postPost(project_id, user_id, content) {},
  
  postMessage(project_id, recipient_id, message) {
    // /chats
    //send project_id and recipient_id in request body along with body:
  }
};

export default ProjectDashService;
