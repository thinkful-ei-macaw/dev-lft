import React from 'react';
import ReactDOM from 'react-dom';
import Carousel from './Carousel';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const slides = [{ slide: 'a' }];
  const props = {
    width: `${slides.length * 100}%`
  };
  ReactDOM.render(
    <BrowserRouter>
      <Carousel {...props}>
        <div />
        <div />
      </Carousel>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
