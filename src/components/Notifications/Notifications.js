import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import config from '../../config';
import { format } from 'date-fns';

class Notifications extends Component {
  state = {
    notifications: []
  };

  componentDidMount() {
    return fetch(`${config.API_ENDPOINT}/notifications`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res =>
        !res.ok ? res.json().then(e => Promise.reject(e)) : res.json()
      )
      .then(res => {
        this.setState({
          notifications: res
        });
      });
  }

  renderNotifications = () => {
    let { notifications } = this.state;
    if (!notifications) {
      return <p>Couldn't find any notifications</p>;
    }

    return notifications.map(item => {
      return (
        <li key={item.id}>
          <p>{item.project_id}</p>
          <p>{item.type}</p>
          <p>{item.seen}</p>
          <p>{format(item.date_created)}</p>
        </li>
      );
    });
  };

  render() {
    return <ul className="notifications-list">{this.renderNotifications()}</ul>;
  }
}

export default Notifications;
