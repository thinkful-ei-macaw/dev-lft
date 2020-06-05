import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, redirect: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => this.refresh(), 5000);
    }
  }

  refresh = () => {
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      return (
        <h1>
          Oops! An error occurred. Sorry about that. Wait 5 seconds or{' '}
          <button onClick={this.refresh}>Click Here</button>
          to refresh.
        </h1>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
