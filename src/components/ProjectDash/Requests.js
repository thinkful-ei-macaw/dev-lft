import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import Button from '../Button/Button';

// images
import { ChatIcon, CloseIcon, CheckIcon } from '../../images';

const Requests = ({
  requests = [],
  handleDecline = () => null,
  handleApprove = () => null,
  handleOpenChatModal = () => null
}) => {

  const pendingRequests = requests.filter(item => item.status === 'pending');

  return (
    <article className="card requests">
      <h3 className="title">Requests</h3>
      {!pendingRequests.length ? (
        <p className="project">No requests at this time.</p>
      ) : (
          <ul>
            {pendingRequests.map(request => (
              <li key={request.id} className="user">
                <Avatar
                  first_name={request.first_name}
                  last_name={request.last_name}
                />
                <div className="content">
                  <h4><Link to={`/users/${request.username}`}>
                    {request.first_name} {request.last_name}
                  </Link></h4>
                  <p>wants to fill your {request.vacancy_title} position</p>
                </div>

                <Button className="clear" onClick={() => handleOpenChatModal(request.user_id)}>
                  <ChatIcon title="Message this user" />
                </Button>
                <Button className="clear" onClick={() => handleApprove(request.id)}>
                  <CheckIcon title="Approve this request" />
                </Button>
                <Button className="clear" onClick={() => handleDecline(request.id)} >
                  <CloseIcon title="Deny this request" />
                </Button>
              </li>
            ))}
          </ul>
        )}

    </article>
  );
};

export default Requests;
