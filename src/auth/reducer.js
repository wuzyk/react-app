import { createReducer, createAction } from 'redux-act';
import { apiCall } from 'api';
import { SESSION_TOKEN_STORAGE_KEY } from 'constants';
import { AUTH_STATE } from './constants';

const INITIAL_STATE = {
  sessionToken: localStorage.getItem(SESSION_TOKEN_STORAGE_KEY),
  status: AUTH_STATE.SESSION_REQUIRED
};

const validateSessionRequest = createAction('validate session request');
const validateSessionSuccess = createAction('validate session success');
const validateSessionFailure = createAction('validate session failure');
const createSessionSuccess = createAction('create session success');
const closeSessionRequest = createAction('close session request');

//
// reducer
//

const reducer = createReducer(
  {
    [validateSessionRequest]: state => ({
      ...state,
      status: AUTH_STATE.SESSION_LOADING
    }),
    [validateSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      session: payload
    }),
    [validateSessionFailure]: state => ({
      ...state,
      status: AUTH_STATE.SESSION_REQUIRED
    }),
    [createSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      sessionToken: payload.Token,
      session: payload
    }),
    [closeSessionRequest]: state => ({
      ...state,
      status: AUTH_STATE.SESSION_LOADING
    })
  },
  INITIAL_STATE
);

reducer.getSessionToken = state => state.auth.sessionToken;
reducer.getAuthStatus = state => state.auth.status;
reducer.getUserId = state => state.auth.session && state.auth.session.UserId;

export default reducer;

//
// actions
//

export const validateSession = () => (dispatch, getState) => {
  const sessionToken = reducer.getSessionToken(getState());

  if (!sessionToken) {
    return;
  }

  dispatch(validateSessionRequest());

  return apiCall({
    url: '/OpenApi/sessions/current',
    secure: false,
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  }).then(
    payload => dispatch(validateSessionSuccess(payload)),
    payload => {
      localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      dispatch(validateSessionFailure(payload));
    }
  );
};

export const createSession = (login, password) => dispatch => {
  return apiCall({
    url: '/OpenApi/sessions',
    secure: false,
    method: 'POST',
    json: {
      Login: login,
      Password: password,
      Scope: 'All'
    }
  }).then(payload => {
    localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, payload.Token);
    dispatch(createSessionSuccess(payload));
  });
};

const shutdown = () => {
  localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  location.reload();
};

export const closeSession = () => dispatch => {
  dispatch(closeSessionRequest());

  return apiCall({
    url: '/OpenApi/sessions',
    method: 'DELETE'
  }).then(shutdown, shutdown);
};
