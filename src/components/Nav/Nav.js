import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import './Nav.css';

// images
import { Logo } from '../../images/'

export default class Nav extends Component {
  static contextType = UserContext;
  state = {
    fixed: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    let isFixed = false;
    if (window.scrollY > 0) {
      isFixed = true;
    }

    if (this.state.fixed !== isFixed) this.setState({ fixed: isFixed });
  }

  renderLinks(links) {
    const currentPath = this.props.location.pathname;
    return links.map(({ text, path }) => (
      <li key={path}>
        <Link to={path} className={path === currentPath ? 'active' : ''}>{text}</Link>
      </li>
    ))
  }

  renderPublicLinks() {
    const publicLinks = [
      { text: 'Sign Up', path: '/signup' },
      { text: 'Login', path: '/login' }
    ]

    return (
      <ul className="links links-right">
        {this.renderLinks(publicLinks)}
      </ul>
    );
  }

  renderPrivateLinks() {
    const privateLinks = [
      { text: 'Feed', path: '/feed' },
      { text: 'Projects', path: '/my-projects' },
      { text: 'Chats', path: '/chats' }
    ]

    const rightLinks = [
      { text: 'Settings', path: '/settings' }
    ]

    return (
      <React.Fragment>
        <ul className="links links-left">
          {this.renderLinks(privateLinks)}
        </ul>

        <ul className="links links-right">
          {this.renderLinks(rightLinks)}
          <li>
            <Link to="/" onClick={this.context.onLogOut}>
              Log Out
          </Link>
          </li>
        </ul>
      </React.Fragment>
    );
  }

  render() {
    const { user } = this.context;
    const { fixed } = this.state;

    // the nav bar is absolutely positioned
    // this variable being `true` will render
    // a div push the rest of the content down
    // if user is on any private page (as per design)
    const push = user.isAuth;

    return (
      <React.Fragment>
        <nav className={fixed ? 'fixed' : ''}>
          <div className="wrapper">
            <Link to='/'><Logo className="logo" /></Link>
            {
              user.isAuth
                ? this.renderPrivateLinks()
                : this.renderPublicLinks()
            }
          </div>
        </nav>
        {push ? <div className="nav-push"></div> : ''}
      </React.Fragment>
    );
  }
}
