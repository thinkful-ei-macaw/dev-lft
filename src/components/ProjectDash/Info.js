import React from 'react';

const Info = ({description = '', tags = [] }) => {
  const renderTags = tags => {
    if (!tags.length) {
      return;
    } else if (tags) {
      let tagsList = tags.map(tag => {
        return <li key={tag}>{tag}</li>;
      });
      return tagsList;
    }
  };

  return (
    <>
    <h3>Project Info</h3>
      <p>{description}</p>
      <ul className="tags">{renderTags(tags)}</ul>
    </>
  );
};

export default Info;
