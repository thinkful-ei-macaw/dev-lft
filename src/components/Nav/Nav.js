import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

import UserContext from '../../contexts/UserContext';

export default class Nav extends Component {
  static contextType = UserContext;

  renderPublicLinks() {
    return (
      <ul className="links">
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Log In</Link>
        </li>
      </ul>
    );
  }

  renderPrivateLinks() {
    return (
      <ul className="links">
        <li>
          <Link to="/my-projects">Projects</Link>
        </li>
        <li>
          <Link to="/chats">Chats</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/" onClick={this.context.onLogOut}>
            Log Out
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const { user } = this.context;
    const homeURL = user ? '/feed' : '/';

    return (
      <nav>
        <div className="wrapper">
          <Link to={homeURL}>Dev LFT</Link>
          {user.isAuth ? this.renderPrivateLinks() : this.renderPublicLinks()}
        </div>
      </nav>
    );
  }
}
