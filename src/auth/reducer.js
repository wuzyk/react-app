import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import * as api from './api';
import { SESSION_TOKEN_STORAGE_KEY } from 'constants';

const AUTH_STATE = {
  SESSION_LOADING: 'SESSION_LOADING',
  SESSION_REQUIRED: 'SESSION_REQUIRED',
  SESSION_VALID: 'SESSION_VALID',
  SESSION_CREATING: 'SESSION_CREATING'
};

//
// actions
//

const validateSession = createAction('validate session request');
const validateSessionSuccess = createAction('validate session success');
const validateSessionFailure = createAction('validate session failure');
const createSession = createAction('create session success');
const createSessionSuccess = createAction('create session success');
const createSessionFailure = createAction('create session failure');
const closeSession = createAction('close session request');
const closeSessionResult = createAction('close session result');

const validateSessionApiCall = sessionToken => {
  return api
    .validateSession(sessionToken)
    .then(validateSessionSuccess)
    .catch(error => {
      localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      return validateSessionFailure(error);
    });
};

const createSessionApiCall = ({ login, password }) => {
  return api
    .createSession(login, password)
    .then(payload => {
      localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, payload.Token);
      return createSessionSuccess(payload);
    })
    .catch(createSessionFailure);
};

const shutdown = () => {
  localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  location.reload();
  return closeSessionResult();
};

const closeSessionApiCall = () => {
  return api.closeSession().then(shutdown, shutdown);
};

export { validateSession, createSession, closeSession };

//
// reducer
//

const INITIAL_STATE = {
  sessionToken: localStorage.getItem(SESSION_TOKEN_STORAGE_KEY),
  status: AUTH_STATE.SESSION_REQUIRED,
  error: null
};

const reducer = createReducer(
  {
    [validateSession]: (state, token) => {
      return loop(
        { ...state, status: AUTH_STATE.SESSION_LOADING },
        Effects.promise(validateSessionApiCall, token)
      );
    },
    [validateSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      session: payload
    }),
    [validateSessionFailure]: state => ({
      ...state,
      status: AUTH_STATE.SESSION_REQUIRED
    }),
    [createSession]: (state, payload) => {
      return loop(
        { ...state, error: null, status: AUTH_STATE.SESSION_CREATING },
        Effects.promise(createSessionApiCall, payload)
      );
    },
    [createSessionFailure]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_REQUIRED,
      error: payload
    }),
    [createSessionSuccess]: (state, payload) => ({
      ...state,
      status: AUTH_STATE.SESSION_VALID,
      sessionToken: payload.Token,
      session: payload
    }),
    [closeSession]: state => {
      return loop(
        { ...state, status: AUTH_STATE.SESSION_LOADING },
        Effects.promise(closeSessionApiCall)
      );
    }
  },
  INITIAL_STATE
);

reducer.getSessionToken = state => state.auth.sessionToken;
reducer.getUserId = state => {
  return state.auth.session && state.auth.session.UserId;
};
reducer.getError = state => state.auth.error;
reducer.getIsValid = state => state.auth.status === AUTH_STATE.SESSION_VALID;
reducer.getIsCreating = state => {
  return state.auth.status === AUTH_STATE.SESSION_CREATING;
};
reducer.getIsLoading = state => {
  return state.auth.status === AUTH_STATE.SESSION_LOADING;
};

export default reducer;
