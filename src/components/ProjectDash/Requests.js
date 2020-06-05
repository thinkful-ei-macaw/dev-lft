import React from 'react';
import RequestsList from './RequestsList';

const Requests = ({
  requests = [],
  handleDecline = () => {},
  handleApprove = () => {},
  handleOpenChatModal = () => {},
  handleShowVacancyModal = () => {},
  handleDeleteProject = () => {}
}) => {
  return (
    <article className="creator-options">
    <button onClick={handleShowVacancyModal} type="button">
        Add new vacancy
      </button>
      <button onClick={handleDeleteProject} type="button">
        Delete this project
      </button>
      <div className="pending-requests">
      <h3>Requests</h3>
        <ul className="request">
          <RequestsList
            requests={requests}
            handleDecline={handleDecline}
            handleApprove={handleApprove}
            handleOpenChatModal={handleOpenChatModal}
          />
        </ul>
      </div>
      
    </article>
  );
};

export default Requests;
