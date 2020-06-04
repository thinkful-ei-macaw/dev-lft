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
      <div className="pending-requests">
        <ul className="request">
          <RequestsList
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

export default Requests;
