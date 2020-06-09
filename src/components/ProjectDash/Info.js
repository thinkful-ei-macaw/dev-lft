import React from 'react';

const Info = ({ description = '', tags = [] }) => {
  const renderTags = tags => {
    if (!tags.length) {
      return;
    } else if (tags) {
      let tagsList = tags.map((tag, i) => {
        return <li key={i} className="tag">{tag}</li>;
      });
      return tagsList;
    }
  };

  return (
    <article className="card project-info">
      <h3 className="title">Project Info</h3>
      <p>{description}</p>
      <ul className="tags">{renderTags(tags)}</ul>
    </article>
  );
};

export default Info;
