import React, { Component } from 'react'


const ProjectContext = React.createContext({
  project: {},
  projects: [],
  vacancies: [],
  myProjects: [],
  error: null,
  setError: () => {},
  clearError: () => { },
  setProject: () => {},
  setProjects: () => {},
  clearProject: () => {},
  setMyProject: () => {},
  setVacancies: () => {},
  addProject: () => {},
})

export default ProjectContext

export class ProjectProvider extends Component {
  state = {
    project: {},
    projects: [],
    vacancies: [],
    myProjects: [],
    error: null,
  };

  setError = error => {
    console.error(error)
    this.setState({ error })
  }

  clearError = () => {
    this.setState({ error: null })
  }

  setProject = project => {
    this.setState({ project })
  }

  setProjects = projects => {
    this.setState({ projects })
  }

  setMyProjects = myProjects => {
    this.setState({ myProjects })
  }

  clearProject = () => {
    this.setProject({})
    this.setProjects([])
  }

  addProject = project => {
    this.setProjects([
      ...this.state.projects,
      project
    ])
  }

  render() {
    const value = {
      project: this.state.project,
      projects: this.state.projects,
      vacancies: this.state.vacancies,
      myProjects: this.state.myProjects,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setProject: this.setProject,
      setProjects: this.setProjects,
      setMyProjects: this.setMyProjects,
      clearProject: this.clearProject,
      addProject: this.addProject,
    }
    return (
      <ProjectContext.Provider value={value}>
        {this.props.children}
      </ProjectContext.Provider>
    )
  }
}