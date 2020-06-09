import React, { Component } from 'react';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import ProjectDashService from './project-dash-service';
import Button from '../Button/Button';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postToEdit: null
    }
    this.postForm = React.createRef();
  }


  componentDidMount() {
    ProjectDashService.getPosts(this.props.project_id)
      .then(posts => {
        this.setState({ posts });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  handleEditPost = (post_id) => {
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
    this.postForm.current.reset();

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
            <button onClick={() => this.handleEditPost(post.id)} type="button">
              edit
            </button>
          ) : (
              ''
            )}
          {post.canEdit && postToEdit === post.id ? (
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
    return (
      <article className="card">
        <div className="team-posts">
          <h3 className="title">Discussion</h3>
          <ul>{this.renderPosts()}</ul>
        </div>

        <form onSubmit={this.handleSubmitPost} ref={this.postForm} autoComplete="off">
          <div className="input-group pinned">
            <div className="input">
              <label htmlFor="create-post">What do you want to post?</label>
              <input
                name="create-post"
                id="create-post"
                type="text"
                placeholder="Say Something"
                required
              />
            </div>
            <Button type="submit">Send Message</Button>
          </div>
        </form>

      </article>
    );
  }
}
export default Posts;
