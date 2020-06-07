import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import Button from '../Button/Button';
import './Nav.css';

// images
import { Logo, MenuIcon } from '../../images/';

export default class Nav extends Component {
  static contextType = UserContext;
  static defaultProps = {
    location: {
      pathname: "/"
    }
  }

  state = {
    fixed: false,
    menuOpen: false,
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

  toggleMenu = (newState = !this.state.menuOpen) => {
    if (newState === this.state.menuOpen) return;

    this.setState({
      menuOpen: newState
    });
  }

  renderLinks(links) {
    const currentPath = this.props.location.pathname;
    return links.map(({ text, path, onClick = () => { } }) => (
      <li key={path}>
        <Link
          to={path}
          className={currentPath.includes(path) ? 'active' : ''}
          onClick={() => {
            this.toggleMenu(false);
            onClick();
          }}
        >
          {text}
        </Link>
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
      { text: 'Projects', path: '/projects' },
      { text: 'Chats', path: '/chats' }
    ]

    const rightLinks = [
      { text: 'Account', path: '/account' },
      { text: 'Log Out', path: '/login', onClick: this.context.onLogOut }
    ]

    return (
      <React.Fragment>
        <ul className="links links-left">
          {this.renderLinks(privateLinks)}
        </ul>

        <ul className="links links-right">
          {this.renderLinks(rightLinks)}
        </ul>
      </React.Fragment>
    );
  }

  render() {
    const { user: { isAuth } } = this.context;
    const { fixed, menuOpen } = this.state;

    // the nav bar is absolutely positioned
    // this variable being `true` will render
    // a div to push the rest of the content down
    // if user is on any private page (as per design)
    const push = isAuth;

    return (
      <React.Fragment>
        <nav className={fixed ? 'fixed' : ''}>
          <div className="wrapper">
            <Link to='/'><Logo className="logo" /></Link>
            <div
              role="button"
              className={`link-container-shadow ${menuOpen ? 'active' : ''}`}
              onClick={() => this.toggleMenu(false)}
            >
            </div>
            <div aria-hidden={!menuOpen} role={menuOpen ? 'alert' : ''} className={`link-container ${menuOpen ? 'active' : ''}`}>
              {
                isAuth
                  ? this.renderPrivateLinks()
                  : this.renderPublicLinks()
              }
            </div>
            <Button className="clear menu-btn" onClick={this.toggleMenu}>
              <MenuIcon className="menu" />
            </Button>
          </div>
        </nav>
        {push ? <div className="nav-push"></div> : ''}
      </React.Fragment>
    );
  }
}
