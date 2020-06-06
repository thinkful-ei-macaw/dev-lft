import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Button.css";

class Button extends Component {
  render() {
    const { children, className, disabled = false, onClick = () => null, type = "button", isLink = false } = this.props;
    return !isLink
      ? (
        <button className={`btn btn-${className}`} disabled={disabled} onClick={onClick} type={type}>
          {children}
        </button>
      )
      : (
        <span className={`btn btn-${className}`} disabled={disabled} onClick={onClick} type={type}>
          {children}
        </span>
      )
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLink: PropTypes.bool
}

export default Button;