import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuthenticated = false;

export const AuthRoute = (props) => {
  const { redirect, isPublic, ...restProps } = props;

  return ((isPublic && !isAuthenticated) || (!isPublic && isAuthenticated))
    ? <Route { ...restProps } />
    : <Redirect to={redirect} />
}
