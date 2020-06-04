import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import ProjectLinks from './ProjectLinks';

class Posts extends Component {
  state = {
    posts: [],
    postToEdit: null
  };

  componentDidMount() {
    ProjectDashService.getPosts(this.props.project_id)
      .then(posts => {
        this.setState({ posts });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  handleEditPost = e => {
    e.preventDefault();
    let post_id = e.target.value;
    this.setState({
      postToEdit: post_id
    });
  };

  handlePatchPost = e => {
    e.preventDefault();
    let { project_id } = this.props;
    let post_id = this.state.postToEdit;
    let message = e.target['edit-post'].value;

    ProjectDashService.patchPost(post_id, message)
      .then(() => {
        ProjectDashService.getPosts(project_id).then(posts => {
          this.setState({
            posts,
            postToEdit: null
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleSubmitPost = e => {
    e.preventDefault();
    let { project_id } = this.props;
    let message = e.target['create-post'].value;
    document.getElementById('post-to-project-form').reset();

    ProjectDashService.postPost(project_id, message)
      .then(() => {
        ProjectDashService.getPosts(project_id).then(posts => {
          this.setState({
            posts
          });
        });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  };

  handleCancelEdit = () => {
    this.setState({
      postToEdit: null
    });
  };

  renderPosts = () => {
    let { posts, postToEdit } = this.state;
    if (!posts) {
      return <p>No posts at this time</p>;
    }

    let allPosts = posts.map(post => {
      return (
        <li key={post.id}>
          <p>
            {post.first_name} {post.last_name}: {post.message}
          </p>
          {post.canEdit ? (
            <button value={post.id} onClick={this.handleEditPost} type="button">
              edit
            </button>
          ) : (
            ''
          )}
          {post.canEdit && postToEdit == post.id ? (
            <form
              name="edit-post-form"
              className="edit-post-form"
              onSubmit={this.handlePatchPost}
            >
              <label htmlFor="edit-post">Change to:</label>
              <input type="text" name="edit-post" id="edit-post" />
              <button type="submit">Submit</button>
              <button onClick={this.handleCancelEdit} type="button">
                Cancel
              </button>
            </form>
          ) : (
            ''
          )}
        </li>
      );
    });
    return allPosts;
  };

  render() {
    const { project } = this.props;
    return (
      <article className="team-options">
        <div className="team-posts">
          <ul>{this.renderPosts()}</ul>
        </div>
        <ProjectLinks
          github={project.github_url}
          live={project.live_url}
          trello={project.trello_url}
        />
        <form onSubmit={this.handleSubmitPost} id="post-to-project-form">
          <label htmlFor="create-post">What do you want to post?</label>
          <input name="create-post" id="create-post" type="text" required />
          <button type="submit">Submit Post</button>
        </form>
      </article>
    );
  }
}
export default Posts;
