import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "./Button.css";

class Button extends Component {
  render() {
    const { children, className, disabled = false, onClick = () => null, type = "button" } = this.props;
    return (
      <button className={`btn btn-${className}`} disabled={disabled} onClick={onClick} type={type}>
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
}

export default Button;