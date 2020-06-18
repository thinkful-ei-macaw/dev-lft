import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenService from '../services/token-service';
import { SocketProvider } from '../contexts/SocketContext';

export default function PrivateRoute({ component, ...props }) {
  const Component = component;
  return (
    <Route
      {...props}
      render={componentProps =>
        TokenService.hasAuthToken() ? (
          <SocketProvider>
            <Component {...componentProps} />
          </SocketProvider>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                error: 'You must be logged in to view this page',
                from: componentProps.location
              }
            }}
          />
        )
      }
    />
  );
}
