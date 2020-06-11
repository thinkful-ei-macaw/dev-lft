import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from '../../services/token-service';
import config from '../../config';
import ChatService from '../../services/chat-api-service';
import './Notifications.css';

// images
import { BellIcon } from '../../images';
import NotificationsApiService from '../../services/notification-api-service';

class Notifications extends Component {
  state = {
    notifications: [],
    isOpen: false,
    interval_id: null
  };

  componentDidMount() {
    this.getNotifications();
    const checkNotifications = setInterval(() => {
      this.getNotifications();
    }, 30000);
    this.setState({ interval_id: checkNotifications });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval_id);
  }

  toggleNotificationsPopup = () => {
    const { isOpen } = this.state;

    this.setState({ isOpen: !isOpen });

    if (isOpen) {
      // send patch request on close
      this.markAsSeen();
    }
  }

  getNotifications = () => {
    NotificationsApiService.getNotifications()
      .then(res => {
        this.setState({
          notifications: res
        });
      });
  }

  markAsSeen() {
    NotificationsApiService.patchNotifications()
      .then(this.getNotifications)
  }

  formatNotification = notification => {
    let notificationText = `Somebody ${notification.type}ed ${notification.name}`;
    let notificationTime = ChatService.getFormattedDate(notification.date_created);
    let notificationLink = `/projects/${notification.handle}`;

    if (notification.type === 'chat') {
      notificationText = `New chat message from ${notification.name}`;
      notificationLink = {
        pathname: `/chats`,
        state: {
          filter: notification.name
        }
      };
    } else if (notification.type === 'leave') {
      notificationText = `Someone left ${notification.name}`;
    } else if (notification.type === 'post') {
      notificationText = `Someone posted in ${notification.name}`;
    }

    return (
      <Link to={notificationLink} onClick={this.toggleNotificationsPopup}>
        {notificationText}!
        <span className="time">{notificationTime}</span>
      </Link>
    );
  }

  renderNotifications = () => {
    let { notifications } = this.state;
    if (!notifications) {
      return <p>Couldn't find any notifications</p>;
    }

    return notifications.length
      ? notifications.map((item, i) => {
        return (
          <li key={i}>
            {this.formatNotification(item)}
          </li>
        );
      })
      : <li>Nothing to see here!</li>
  };

  render() {
    const { isOpen, notifications } = this.state;
    return (
      <div className={`notifications ${!isOpen && notifications.length ? 'new' : ''}`}>
        <BellIcon
          className={`bell ${isOpen ? 'open' : ''}`}
          title={`${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
          onClick={this.toggleNotificationsPopup}
        />
        <ul className={`notifications-list card ${isOpen ? 'active' : ''}`}>
          {this.renderNotifications()}
        </ul>
      </div>
    );
  }
}

export default Notifications;
