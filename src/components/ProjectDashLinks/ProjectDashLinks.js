import React from 'react';

const ProjectDashLinks = ({ github, live, trello }) => {
  return (
    <>
      <a
        className="links"
        rel="noopener noreferrer"
        target="_blank"
        href={github}
      >
        Github
      </a>
      <a
        className="links"
        rel="noopener noreferrer"
        target="_blank"
        href={live}
      >
        Live Page
      </a>
      <a
        className="links"
        rel="noopener noreferrer"
        target="_blank"
        href={trello}
      >
        Trello
      </a>
    </>
  );
};

export default ProjectDashLinks;
