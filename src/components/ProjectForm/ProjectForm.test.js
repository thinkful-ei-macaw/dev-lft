import React from 'react';
import ReactDOM from 'react-dom';
import ProjectForm from './ProjectForm';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const stub = () => null;
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <ProjectForm onCreate={stub} onCancel={stub} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
