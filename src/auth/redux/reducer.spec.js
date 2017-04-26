import { createStore } from 'redux';
import { install } from 'redux-loop';
import * as api from './api';

import reducer, {
  validateSession,
  validateSessionSuccess,
  validateSessionFailure,
  createSession,
  createSessionSuccess,
  createSessionFailure,
  sessionReceived
} from './reducer';

jest.mock('./api');

describe('auth reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      session: null,
      isLoading: false,
      isLoggining: false,
      error: null
    });
  });

  it('should handle VALIDATE_SESSION', () => {
    expect(reducer(undefined, validateSession('token'))[0]).toEqual({
      session: null,
      isLoading: true,
      isLoggining: false,
      error: null
    });
  });

  it('should handle VALIDATE_SESSION_SUCCESS', () => {
    expect(reducer(undefined, validateSessionSuccess())[0]).toEqual({
      session: null,
      isLoading: false,
      isLoggining: false,
      error: null
    });
  });

  it('should handle VALIDATE_SESSION_FAILURE', () => {
    expect(reducer(undefined, validateSessionFailure())).toEqual({
      session: null,
      isLoading: false,
      isLoggining: false,
      error: null
    });
  });

  it('should handle CREATE_SESSION', () => {
    expect(reducer(undefined, createSession('token'))[0]).toEqual({
      session: null,
      isLoading: false,
      isLoggining: true,
      error: null
    });
  });

  it('should handle CREATE_SESSION_SUCCESS', () => {
    expect(reducer(undefined, createSessionSuccess())[0]).toEqual({
      session: null,
      isLoading: false,
      isLoggining: false,
      error: null
    });
  });

  it('should handle CREATE_SESSION_FAILURE', () => {
    const payload = { message: 'error' };
    expect(reducer(undefined, createSessionFailure(payload))).toEqual({
      session: null,
      isLoading: false,
      isLoggining: false,
      error: payload.message
    });
  });

  it('should handle SESSION_RECEIVED', () => {
    const payload = { Token: 'token' };

    expect(reducer(undefined, sessionReceived(payload))).toEqual({
      session: payload,
      isLoading: false,
      isLoggining: false,
      error: null
    });
  });
});

describe('auth async action', () => {
  let store;
  let actions;
  let mockReducer;

  beforeEach(() => {
    actions = [];
    mockReducer = (state, action) => {
      if (action.type !== '@@redux/INIT') {
        actions.push(action);
      }

      return reducer(state, action);
    };
    store = install()(createStore)(mockReducer);
  });

  describe('validateSession', () => {
    it('should handle success response', () => {
      const payload = { Token: '123' };

      api.validateSession.mockImplementation(() => Promise.resolve(payload));

      return store.dispatch(validateSession('token')).then(() => {
        expect(actions).toEqual([
          validateSession('token'),
          validateSessionSuccess(payload),
          sessionReceived(payload)
        ]);
      });
    });

    it('should handle error response', () => {
      const error = { message: 'error' };

      api.validateSession.mockImplementation(() => Promise.reject(error));

      return store.dispatch(validateSession('token')).then(() => {
        expect(actions).toEqual([
          validateSession('token'),
          validateSessionFailure(error)
        ]);
      });
    });
  });

  describe('createSession', () => {
    it('should handle success response', () => {
      const payload = { Token: '123' };

      api.createSession.mockImplementation(() => Promise.resolve(payload));

      return store.dispatch(createSession('login', 'password')).then(() => {
        expect(actions).toEqual([
          createSession('login', 'password'),
          createSessionSuccess(payload),
          sessionReceived(payload)
        ]);
      });
    });

    it('should handle error response', () => {
      const error = { message: 'error' };

      api.createSession.mockImplementation(() => Promise.reject(error));

      return store.dispatch(createSession('token')).then(() => {
        expect(actions).toEqual([
          createSession('token'),
          createSessionFailure(error)
        ]);
      });
    });
  });
});
