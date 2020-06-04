import React from 'react';
import { Link } from 'react-router-dom';

const RequestsList = ({
  requests = [],
  handleDecline = () => {},
  handleApprove = () => {},
  handleOpenChatModal = () => {}
}) => {
  let pendingRequests = requests.filter(item => item.status === 'pending');

  return (
    <>
      {!requests.length ? (
        <p>No requests at this time.</p>
      ) : (
        pendingRequests.map(request => (
          <li key={request.id}>
            <Link to={`/users/${request.username}`}>
              {request.first_name} {request.last_name}
            </Link>
            wants to fill your {request.vacancy_title} role
            <button value={request.id} onClick={handleDecline} type="button">
              Decline
            </button>
            <button value={request.id} onClick={handleApprove} type="button">
              Approve
            </button>
            <button
              value={request.user_id}
              onClick={handleOpenChatModal}
              type="button"
            >
              Message
            </button>
          </li>
        ))
      )}
    </>
  );
};

export default RequestsList;
