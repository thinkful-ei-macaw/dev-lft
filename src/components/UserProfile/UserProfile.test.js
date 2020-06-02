import React from 'react';
import ReactDOM from 'react-dom';
import UserProfile from './UserProfile';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    match: {
      params: {
        user_id: 1
      }
    }
  };
  ReactDOM.render(
    <BrowserRouter>
      <UserProfile {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
