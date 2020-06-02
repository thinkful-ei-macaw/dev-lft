import React from 'react';
import ReactDOM from 'react-dom';
import Settings from './Settings';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    user_id:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNTgzNzI0MzAwLCJleHAiOjE1ODM4MTA3NTV9.fGA40guZ5zA4dy73bxqVh5zOPg4PLaFQQW31CpNJDbc'
  };
  ReactDOM.render(
    <BrowserRouter>
      <Settings {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
