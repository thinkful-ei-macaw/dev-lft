import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

import TokenService from '../../services/token-service';

export default class Nav extends Component {
  state = {
    isLoggedIn: TokenService.hasAuthToken()
  }

  handleLogOut = () => {
    TokenService.clearAuthToken();
    this.setState({
      isLoggedIn: TokenService.hasAuthToken()
    })
  }

  renderPublicLinks() {
    return (
      <ul className="links">
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/login">Log In</Link></li>
      </ul>
    )
  }

  renderPrivateLinks() {
    return (
      <ul className="links">
        <li><Link to="/my-projects">Projects</Link></li>
        <li><Link to="/chats">Chats</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/" onClick={this.handleLogOut}>Log Out</Link></li>
      </ul>
    )
  }

  render() {
    const { isLoggedIn } = this.state;
    const homeURL = isLoggedIn ? "/feed" : "/";

    return (
      <nav>
        <div className="wrapper">
          <Link to={homeURL}>Dev LFT</Link>
          {
            isLoggedIn
              ? this.renderPrivateLinks()
              : this.renderPublicLinks()
          }
        </div>
      </nav>
    )
  }
}
