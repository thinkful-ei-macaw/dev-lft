import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Button from '../Button/Button';
import TokenService from '../../services/token-service';
import ApiAuthService from '../../services/auth-api-service.js';
import UserContext from '../../contexts/UserContext';
import './Login.css';

class Login extends React.Component {
  static defaultProps = {
    history: {
      push: () => { }
    }
  };

  static contextType = UserContext;

  state = { error: null };

  handleLogin = e => {
    e.preventDefault();
    const { user_name, password } = e.target;
    this.setState({ error: null });
    ApiAuthService.postLogin({
      username: user_name.value,
      password: password.value
    })
      .then(user => {
        user_name.value = '';
        password.value = '';
        TokenService.saveAuthToken(user.authToken);
        this.context.onAuth();
        this.props.history.push('/feed');
      })
      .catch(res => {
        this.setState({ error: res.error || res.message });
      });
  };

  render() {
    const error = this.state.error;
    return (
      <div className="log-in hero">

        <Helmet>
          <title>Log In - Dev LFT</title>
        </Helmet>

        <form className="card" onSubmit={this.handleLogin} autoComplete="off">
          <h2 className="h3 title">Welcome Back.</h2>
          <p className="subtitle">Fill in the fields below to log in.</p>
          {error ? <p role="alert" className="error">{error}</p> : ''}
          <div className="input-group">
            <div className="input">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="johndoe" name="user_name" required />
            </div>
          </div>
          <div className="input-group">
            <div className="input">
              <label htmlFor="pwd">Password</label>
              <input type="password" id="pwd" name="password" required />
            </div>
          </div>

          <Button type="submit">Log In</Button>

          <p>
            Don't have an account yet? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};
export default Login;
