// import config from "../config";
// import TokenService from "../services/token-service";
let url = 'http://localhost:8000/api';

const ProjectDashService = {
  getProject() {
    return fetch(`${url}/projects/:project_id`, {
      method: 'GET',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getVacancies() {
    return fetch(`${url}/vacancies/:project_id`, {
      method: 'GET',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  postVacancies(title, description, skills) {
    return fetch(`${url}/vacancies/:project_id`, {
      method: 'POST',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
      body: {
        title, description, skills
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },
  
  patchVacancies() {},

  getRequest() {
    return fetch(`${url}/requests`, {
      method: 'GET',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  deleteRequest() {
    return fetch(`${url}/requests/:request_id`, {
      method: 'DELETE',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },

  getPosts() {
    return fetch(`${url}/posts/:project_id`, {
      method: 'GET',
      headers: {
        // authorization: `Bearer ${TokenService.getAuthToken()}`,
      }
    }).then(res =>
      !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
    );
  },
  postPost() {},
  postChat() {},
  postMessage() {},
};

export default ProjectDashService;
