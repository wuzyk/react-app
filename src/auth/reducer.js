import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import { apiCall } from 'api';
import { SESSION_TOKEN_STORAGE_KEY } from 'constants';
import { AUTH_STATE } from './constants';

//
// actions
//

const validateSession = createAction('validate session request');
const validateSessionSuccess = createAction('validate session success');
const validateSessionFailure = createAction('validate session failure');
const createSession = createAction('create session success');
const createSessionSuccess = createAction('create session success');
const closeSession = createAction('close session request');
const closeSessionResult = createAction('close session result');

const validateSessionApiCall = sessionToken => {
  return apiCall({
    url: '/OpenApi/sessions/current',
    secure: false,
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  })
    .then(payload => validateSessionSuccess(payload))
    .catch(error => {
      localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      return validateSessionFailure(error);
    });
};

const createSessionApiCall = ({ login, password }) => {
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
    return createSessionSuccess(payload);
  });
};

const shutdown = () => {
  localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  location.reload();
  return closeSessionResult();
};

const closeSessionApiCall = () => {
  return apiCall({
    url: '/OpenApi/sessions',
    method: 'DELETE'
  }).then(shutdown, shutdown);
};

export { validateSession, createSession, closeSession };

//
// reducer
//

const INITIAL_STATE = {
  sessionToken: localStorage.getItem(SESSION_TOKEN_STORAGE_KEY),
  status: AUTH_STATE.SESSION_REQUIRED
};

const reducer = createReducer(
  {
    [validateSession]: (state, token) =>
      loop(
        {
          ...state,
          status: AUTH_STATE.SESSION_LOADING
        },
        Effects.promise(validateSessionApiCall, token)
      ),
    [validateSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      session: payload
    }),
    [validateSessionFailure]: state => ({
      ...state,
      status: AUTH_STATE.SESSION_REQUIRED
    }),
    [createSession]: (state, payload) =>
      loop(state, Effects.promise(createSessionApiCall, payload)),
    [createSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      sessionToken: payload.Token,
      session: payload
    }),
    [closeSession]: state =>
      loop(
        {
          ...state,
          status: AUTH_STATE.SESSION_LOADING
        },
        Effects.promise(closeSessionApiCall)
      )
  },
  INITIAL_STATE
);

reducer.getSessionToken = state => state.auth.sessionToken;
reducer.getAuthStatus = state => state.auth.status;
reducer.getUserId = state => state.auth.session && state.auth.session.UserId;

export default reducer;
