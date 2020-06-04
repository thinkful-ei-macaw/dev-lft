import React from 'react';
import ProjectDashRequestsList from '../ProjectDashRequestsList/ProjectDashRequestsList';

const ProjectDashRequests = ({
  requests = [],
  handleDecline = () =>{},
  handleApprove = () => {},
  handleOpenChatModal = () => {},
  handleShowVacancyModal = ()=> {},
  handleDeleteProject = () => 
}) => {
  return (
    <article className="creator-options">
      <div className="pending-requests">
        <ul className="request">
          <ProjectDashRequestsList
            requests={requests}
            handleDecline={handleDecline}
            handleApprove={handleApprove}
            handleOpenChatModal={handleOpenChatModal}
          />
        </ul>
      </div>
      <button onClick={handleShowVacancyModal} type="button">
        Add new vacancy
      </button>
      <button onClick={handleDeleteProject} type="button">
        Delete this project
      </button>
    </article>
  );
};

export default ProjectDashRequests;
