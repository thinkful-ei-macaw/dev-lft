const project = {
  name: 'project 1',
  description: 'stuff about this project is cool',
  tags: ['react', 'css', 'javascript'],
  github_url: 'https://github.com/thinkful-ei-macaw/dev-lft'
};

const requests = [
  { id: 1, name: 'Michael Scott' },
  { id: 2, name: 'Pam Beesly' }
];

const vacancies = [
  {
    id: 2,
    title: 'Front-end Developer',
    user_id: null,
    description: 'build client stuff',
    skills: ['React', 'Javascript', 'CSS']
  },
  {
    id: 3,
    title: 'Back-end Developer',
    user_id: 'filled position',
    description: 'build server stuff',
    skills: ['Node', 'Javascript', 'Express']
  }
];

export { project, requests, vacancies };
