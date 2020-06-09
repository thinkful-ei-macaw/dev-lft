import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import UserContext from '../../contexts/UserContext';
import ProjectDashService from './project-dash-service';
import Button from '../Button/Button';
import Avatar from '../Avatar/Avatar';

// images
import { EditIcon } from '../../images';

class Posts extends Component {
  static contextType = UserContext;

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
    const { posts, postToEdit } = this.state;
    const { user: { username } } = this.context;
    if (!posts) {
      return <li className="project">No posts at this time</li>;
    }
    let allPosts = posts.map(post => {
      return (
        <li key={post.id} className="message">
          <header className="user-info">
            <Avatar first_name={post.first_name} last_name={post.last_name} />
            <h4 className="h5">
              {post.username === username
                ? 'You'
                : <Link to={`/users/${post.username}`}>{post.first_name} {post.last_name}</Link>}
            </h4>
            <span className="date">{this.renderDate(post.date_created)}</span>
            {post.canEdit
              ? (
                <Button
                  onClick={() => this.handleEditPost(post.id)}
                  disabled={postToEdit === post.id}
                  className="clear"
                  title="Edit post"
                >
                  <EditIcon />
                </Button>
              )
              : ''}
          </header>

          {postToEdit === post.id
            ? (
              <form
                name="edit-post-form"
                className="body"
                onSubmit={this.handlePatchPost}
              >
                <label className="hidden" htmlFor="edit-post">Change to:</label>
                <input autoFocus type="text" name="edit-post" id="edit-post" defaultValue={post.message} placeholder="Say something" />
                <Button type="submit">Update</Button>
                <Button onClick={this.handleCancelEdit} className="clear">Cancel</Button>
              </form>
            )
            : (
              <p className="body">
                {post.message}
              </p>
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
          <ul className="chats">{this.renderPosts()}</ul>
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
