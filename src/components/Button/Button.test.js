import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Button>Test Button</Button>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
