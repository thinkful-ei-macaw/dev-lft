import React from 'react';
import ReactDOM from 'react-dom';
import Settings from './Settings';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Settings />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
