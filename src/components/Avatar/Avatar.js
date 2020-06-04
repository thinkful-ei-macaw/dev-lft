import React from 'react';
import './Avatar.css';

const Avatar = ({ first_name = '', last_name = '', className = '' }) => {
  const getNameInitials = (firstName, lastName) => {
    // toString () helps avoid NaN warning from React
    // by ensuring any response is a string.
    return (firstName[0] + lastName[0]).toString();
  };
  return (
    <span className={`Avatar__logo ${className}`}>
      <span className="Avatar__logo_initials">
        {getNameInitials(first_name, last_name)}
      </span>
    </span>
  );
};

export default Avatar;
