import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import * as api from './api';

//
// actions
//

export const validateSession = createAction('VALIDATE SESSION');
export const validateSessionSuccess = createAction('VALIDATE SESSION SUCCESS');
export const validateSessionFailure = createAction('VALIDATE SESSION FAILURE');
export const createSession = createAction('CREATE SESSION');
export const createSessionSuccess = createAction('CREATE SESSION SUCCESS');
export const createSessionFailure = createAction('CREATE SESSION FAILURE');
export const closeSession = createAction('CLOSE SESSION');
export const closeSessionResult = createAction('CREATE SESSION RESULT');
export const sessionReceived = createAction('SESSION RECEIVED');

const validateSessionApiCall = sessionToken => {
  return api
    .validateSession(sessionToken)
    .then(validateSessionSuccess)
    .catch(validateSessionFailure);
};

const createSessionApiCall = ({ login, password }) => {
  return api
    .createSession(login, password)
    .then(createSessionSuccess)
    .catch(createSessionFailure);
};

const closeSessionApiCall = () => {
  return api.closeSession().then(closeSessionResult, closeSessionResult);
};

//
// reducer
//

const INITIAL_STATE = {
  session: null,
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
    [createSessionFailure]: (state, error) => {
      return {
        ...state,
        isLoggining: false,
        error: error.message
      };
    },
    [sessionReceived]: (state, payload) => ({
      ...state,
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
      session: null,
      isLoading: false
    })
  },
  INITIAL_STATE
);

reducer.getSessionToken = state =>
  state.auth.session && state.auth.session.Token;
reducer.getError = state => state.auth.error;
reducer.getIsLoggining = state => state.auth.isLoggining;
reducer.getIsLoading = state => state.auth.isLoading;

export default reducer;
