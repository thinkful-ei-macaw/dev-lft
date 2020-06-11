import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import ProjectApiService from '../../services/project-api-service';
import './ProjectForm.css';

export default class ProjectForm extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.helperspan = null; // is set via ref

    this.state = {
      tags: [],
      error: null
    };
    this.id = -1;
  }

  handleChange(event) {
    event.preventDefault();
    const input = event.target.value;
    this.setState({ skill: input });
  }

  handleKeypress(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
      var newArray = this.state.tags;
      var currentcontent = this.state.skill;
      if (!currentcontent) {
        return;
      }

      newArray.push({
        content: currentcontent,
        id: ++this.id
      });
      this.setState({
        tags: newArray,
        skill: ''
      });
    }
  }

  handleClick(event) {
    event.preventDefault();
    const idToRemove = Number(event.target.dataset['item']);
    const newArray = this.state.tags.filter(listitem => {
      return listitem.id !== idToRemove;
    });
    this.setState({ tags: newArray });
  }

  makeAddedList() {
    const elements = this.state.tags.map((listitem, index) => (
      <li
        className="tag skill"
        key={listitem.id}
        onClick={this.handleClick}
        data-item={listitem.id}
      >
        {listitem.content} x
      </li>
    ));
    return elements;
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      project_name,
      description,
      live_url,
      trello_url,
      github_url
    } = e.target;
    const tags = this.state.tags.map(tag => tag.content);
    ProjectApiService.postProject(
      project_name.value,
      description.value,
      tags,
      live_url.value,
      trello_url.value,
      github_url.value
    )
      .then(() => {
        this.props.onCreate();
      })
      .catch(res => {
        this.setState({
          error: res.error || 'Something went wrong. Please try again later'
        });
      });
  };

  render() {
    return (
      <form
        role="alert"
        className="project-form card"
        onSubmit={this.handleSubmit}
        autoComplete="off"
      >
        <div className="project">
          <div className="project-left">
            <div className="input-group name-input">
              <div className="input">
                <label htmlFor="project_name">Project Name *</label>
                <input
                  autoFocus={true}
                  placeholder="New Project"
                  minLength="2"
                  maxLength="30"
                  type="text"
                  name="project_name"
                  id="project_name"
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="description">Project Description *</label>
                <textarea
                  rows="8"
                  name="description"
                  id="description"
                  required
                  minLength="10"
                  maxLength="255"
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="project-right">
            <div className="input-group">
              <div className="input">
                <label htmlFor="add">
                  Hit "Enter" to confirm, Click x to remove
                </label>
                <br />
                <input
                  id="add"
                  type="text"
                  name="tagvalue"
                  autoComplete="off"
                  placeholder="HTML"
                  maxLength="70"
                  required
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeypress}
                  value={this.state.skill}
                />
                <ul className="tags">{this.makeAddedList()}</ul>
                <span id="helperspan" ref={el => (this.helperspan = el)}></span>
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="live_url">Live URL</label>
                <input
                  type="url"
                  name="live_url"
                  placeholder="https://newproject.com"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="trello_url">Trello URL</label>
                <input
                  type="url"
                  name="trello_url"
                  placeholder="https://trello.com/b/new-project"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input">
                <label htmlFor="live_url">GitHub URL</label>
                <input
                  type="url"
                  name="github_url"
                  placeholder="https://github.com/user/new-project"
                />
              </div>
            </div>
          </div>
        </div>

        {this.state.error ? (
          <p role="alert" className="project error">
            {this.state.error}
          </p>
        ) : (
          ''
        )}

        <Button type="submit">Create Project</Button>
        <Button className="clear" onClick={this.props.onCancel}>
          Cancel
        </Button>
      </form>
    );
  }
}

ProjectForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
