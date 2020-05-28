import React, { Component } from 'react';

export default class FeedItem extends Component {
  
  render() {
    let vacancy = this.props.vacancy;
    
    return (
      <div className="oneProject">
        <h3>
          <span className="bold">Title:</span>
          {vacancy.title}
        </h3>
        <p>
          <span className="bold">Description:</span>
          {vacancy.description}
        </p>
        <p>
          <span className="bold">Skills:</span>
          {vacancy.skills.map((skill, i) => {
            return <li key={i}>{skill}</li>
          })}
        </p>
      </div>
    );
  }
}
