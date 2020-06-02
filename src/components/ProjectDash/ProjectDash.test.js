import React from 'react';
import ReactDOM from 'react-dom';
import ProjectDash from './ProjectDash';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    match: {
      params: {
        projectId: 1
      }
    }
  };

  ReactDOM.render(
    <BrowserRouter>
      <ProjectDash {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
