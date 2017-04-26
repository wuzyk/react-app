import { apiCall } from 'api';

export const validateSession = token =>
  apiCall({
    url: '/OpenApi/sessions/current',
    secure: false,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const createSession = (login, password) =>
  apiCall({
    url: '/OpenApi/sessions',
    secure: false,
    method: 'POST',
    json: {
      Login: login,
      Password: password,
      Scope: 'All'
    }
  });

export const closeSession = () =>
  apiCall({
    url: '/OpenApi/sessions',
    method: 'DELETE'
  });
