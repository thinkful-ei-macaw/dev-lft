import React from 'react';

const UserContext = React.createContext({
  user: null,
  onAuth: () => null,
  onLogOut: () => null
});

export default UserContext;
