import React from 'react';
import './Login.css';
import TokenService from '../../services/token-service';
import ApiAuthService from '../../services/auth-api-service.js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from '../../contexts/UserContext';

class Login extends React.Component {
  static defaultProps = {
    history: {
      push: () => {}
    }
  };

  static contextType = UserContext;

  state = { error: null };

  handleJWTSubmission = e => {
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
        this.setState({ error: res.error });
      });
  };

  render() {
    const error = this.state.error;
    return (
      <div className="loginpage">
        <header>
          <h2 className="devlogin">DEV LFT</h2>
        </header>
        <form onSubmit={this.handleJWTSubmission}>
          <fieldset>
            <h3>Sign In</h3>
            <div role="alert">
              <p className="error">{error}</p>
            </div>
            <label htmlFor="username">username:</label>
            <input type="text" id="username" name="user_name" required />
            <br />
            <label htmlFor="pwd">password:</label>
            <input type="password" id="pwd" name="password" required />
            <br />
            <button type="submit" className="loginbtn">
              LOG IN
            </button>
            <br />
            <label htmlFor="member">Not a member?</label>
            <Link to={`/signup`}>SIGN UP</Link>
          </fieldset>
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
