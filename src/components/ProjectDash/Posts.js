import React, { Component } from 'react';
import ProjectDashService from './project-dash-service';
import ProjectLinks from './ProjectLinks';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';

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

  renderDate = date => {
    let currentTime = new Date();
    let postDate = new Date(date);
    let diffInHrs = differenceInHours(currentTime, postDate);
    let diffInMins = differenceInMinutes(currentTime, postDate);
    switch (true) {
      case diffInHrs < 1:
        return `${diffInMins}m ago`
      case diffInHrs < 24:
        return `${diffInHrs}h ago`;
      case diffInHrs < 48:
        return `Yesterday`;
      default:
        return format(postDate, 'EEEE');
    }
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
          <p>{this.renderDate(post.date_created)}</p>
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
          <h3>Discussion</h3>
          <ul>{this.renderPosts()}</ul>
        </div>

        <form onSubmit={this.handleSubmitPost} id="post-to-project-form">
          <label htmlFor="create-post">What do you want to post?</label>
          <input
            name="create-post"
            id="create-post"
            type="text"
            placeholder="Say Something"
            required
          />
          <button type="submit">Send Message</button>
        </form>
        <ProjectLinks
          github={project.github_url}
          live={project.live_url}
          trello={project.trello_url}
        />
      </article>
    );
  }
}
export default Posts;
