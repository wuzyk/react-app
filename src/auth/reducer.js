import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import * as api from './api';
import { SESSION_TOKEN_STORAGE_KEY } from 'constants';

//
// actions
//

export const validateSession = createAction('validate session request');
export const validateSessionSuccess = createAction('validate session success');
export const validateSessionFailure = createAction('validate session failure');
export const createSession = createAction('create session success');
export const createSessionSuccess = createAction('create session success');
export const createSessionFailure = createAction('create session failure');
export const closeSession = createAction('close session request');
export const closeSessionResult = createAction('close session result');
export const sessionReceived = createAction('session received');

const validateSessionApiCall = sessionToken => {
  return api
    .validateSession(sessionToken)
    .then(validateSessionSuccess)
    .catch(error => {
      if (localStorage) localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      return validateSessionFailure(error);
    });
};

const createSessionApiCall = ({ login, password }) => {
  return api
    .createSession(login, password)
    .then(payload => {
      if (localStorage)
        localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, payload.Token);
      return createSessionSuccess(payload);
    })
    .catch(createSessionFailure);
};

const shutdown = () => {
  if (localStorage) localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
  location.reload();
  return closeSessionResult();
};

const closeSessionApiCall = () => {
  return api.closeSession().then(shutdown, shutdown);
};

//
// reducer
//

const INITIAL_STATE = {
  sessionToken: global.localStorage &&
    global.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY),
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
    [validateSessionSuccess]: (state, payload) => {
      return loop(
        { ...state, isLoading: false },
        Effects.call(sessionReceived, payload)
      );
    },
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
    [createSessionSuccess]: (state, payload) => {
      return loop(
        { ...state, isLoggining: false },
        Effects.call(sessionReceived, payload)
      );
    },
    [createSessionFailure]: (state, error) => ({
      ...state,
      isLoggining: false,
      error: error.message
    }),
    [sessionReceived]: (state, payload) => ({
      ...state,
      isValid: true,
      session: payload
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
