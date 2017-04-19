import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import * as api from './api';
import { SESSION_TOKEN_STORAGE_KEY } from 'constants';

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
  isValid: false,
  isLoading: false,
  isLoggining: false,
  error: null
};

const reducer = createReducer(
  {
    [validateSession]: (state, token) => {
      return loop(
        { ...state, isLoading: true },
        Effects.promise(validateSessionApiCall, token)
      );
    },
    [validateSessionSuccess]: (state, payload) => ({
      ...state,
      isLoading: false,
      isValid: true,
      session: payload
    }),
    [validateSessionFailure]: state => ({
      ...state,
      isLoading: false
    }),
    [createSession]: (state, payload) => {
      return loop(
        { ...state, error: null, isLoggining: true },
        Effects.promise(createSessionApiCall, payload)
      );
    },
    [createSessionSuccess]: (state, payload) => ({
      ...state,
      isValid: true,
      isLoggining: false,
      session: payload
    }),
    [createSessionFailure]: (state, error) => ({
      ...state,
      isLoggining: false,
      error: error.message
    }),
    [closeSession]: state => {
      return loop(
        { ...state, isLoading: true },
        Effects.promise(closeSessionApiCall)
      );
    },
    [closeSessionResult]: state => ({
      ...state,
      isLoading: false
    })
  },
  INITIAL_STATE
);

reducer.getSessionToken = state => state.auth.sessionToken;
reducer.getError = state => state.auth.error;
reducer.getIsValid = state => state.auth.isValid;
reducer.getIsLoggining = state => state.auth.isLoggining;
reducer.getIsLoading = state => state.auth.isLoading;

export default reducer;
