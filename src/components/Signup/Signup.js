import React from 'react';
import './Signup.css';
import ApiAuthService from '../../services/auth-api-service';
import { Link } from 'react-router-dom';

class Signup extends React.Component {
  state = { error: null };

  getUserCredentials = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const firstname = e.target.first_name.value;
    const lastname = e.target.last_name.value;

    ApiAuthService.postUser({
      username: username,
      password: password,
      first_name: firstname,
      last_name: lastname
    })
      .then(() => {
        this.props.history.push('/feed');
      })
      .catch(res => {
        console.log(res);
        this.setState({ error: res.error });
      });
  };

  render() {
    const error = this.state.error;
    return (
      <div className="signuppage">
        <header>
          <h2 className="devsignup">DEV LFT</h2>
        </header>
        <form onSubmit={this.getUserCredentials}>
          <fieldset>
            <h3>Sign Up</h3>
            <div role="alert">{error && <p className="error">{error}</p>}</div>
            <label htmlFor="firstname">first name:</label>
            <input type="text" id="firstname" name="first_name" required />
            <br />
            <label htmlFor="lastname">last name:</label>
            <input type="text" id="lastname" name="last_name" required />
            <br />
            <label htmlFor="username">username:</label>
            <input type="text" id="username" name="user_name" required />
            <br />
            <label htmlFor="pwd">password:</label>
            <input type="password" id="pwd" name="password" required />
            <br />
            <button type="submit" className="signupbtn">
              SIGN UP
            </button>
            <br />
            <label htmlFor="member">Already a member?</label>
            <Link to={`/login`}>LOG IN</Link>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Signup;
