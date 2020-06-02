import React from 'react';
import ReactDOM from 'react-dom';
import ChatMessages from './ChatMessages';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    history: {
      location: {
        state: {
          chat_id: 1
        }
      }
    }
  };
  ReactDOM.render(
    <BrowserRouter>
      <ChatMessages {...props} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
