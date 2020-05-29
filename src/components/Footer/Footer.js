import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="wrapper">
          <h2><Link to="/">Dev LFT</Link></h2>
          <p>All rights reserved.</p>
        </div>
      </footer>
    )
  }
}
