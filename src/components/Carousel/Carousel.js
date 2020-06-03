import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Carousel.css';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: props.startSlide || 0
    };
  }

  goToSlide(number) {
    const slideCount = this.props.children.length;
    this.setState({
      currentSlide: number % slideCount
    });
  }

  render() {
    const slides = this.props.children;
    const { currentSlide } = this.state;
    const style = {
      width: `${slides.length * 100}%`,
      transform: `translateX(-${(100 / slides.length) * currentSlide}%)`
    };
    return (
      <div className="carousel">
        <div className="carousel-slider" style={style}>
          {slides}
        </div>
        <div className="dots">
          {slides.map((slide, index) => (
            <button
              onClick={() => this.goToSlide(index)}
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
            ></button>
          ))}
        </div>
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  startSlide: PropTypes.number
};
