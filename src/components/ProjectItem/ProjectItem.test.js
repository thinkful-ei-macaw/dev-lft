import React from 'react';
import ReactDOM from 'react-dom';
import ProjectItem from './ProjectItem';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    project: {
      name: 'Best App everrr',
      tags: ['React']
    }
  };
  ReactDOM.render(
    <BrowserRouter>
      <ProjectItem {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
