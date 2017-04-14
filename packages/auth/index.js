import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthPageContainer } from './components/AuthPageContainer';

const isAuthenticated = false;

const PrivateRoute = (props) => {
  const { redirect, ...restProps } = props;

  return isAuthenticated
    ? <Route { ...restProps } />
    : <Redirect to={redirect} />
}

const AuthRoute = (props) => {
  const { redirect, ...restProps } = props;

  return isAuthenticated
    ? <Redirect to={redirect} />
    : <Route { ...restProps } />
}

export {
  PrivateRoute,
  AuthRoute,
  AuthPageContainer as AuthPage,
}
