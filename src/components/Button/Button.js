import React, { Component } from 'react';
import "./Button.css";

export default class Button extends Component {
  render() {
    const { children, className, disabled = false, onClick = () => null } = this.props;
    return (
      <button className={`btn btn-${className}`} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    )
  }
}
