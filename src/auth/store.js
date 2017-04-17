import { apiCall } from 'api';

const SESSION_VALIDATE_REQUEST = 'auth/SESSION_VALIDATE_REQUEST';
const SESSION_VALIDATE_SUCCESS = 'auth/SESSION_VALIDATE_SUCCESS';
const SESSION_VALIDATE_FAILURE = 'auth/SESSION_VALIDATE_FAILURE';

const SESSION_CREATE_REQUEST = 'auth/SESSION_CREATE_REQUEST';
const SESSION_CREATE_SUCCESS = 'auth/SESSION_CREATE_SUCCESS';

const SESSION_CLOSE_REQUEST = 'auth/SESSION_SLOSE_REQUEST';

export const AUTH_STATE = {
  SESSION_LOADING: 'SESSION_LOADING',
  SESSION_REQUIRED: 'SESSION_REQUIRED',
  SESSION_VALID: 'SESSION_VALID'
};

const SESSION_TOKEN_STORAGE_NAME = 'sessionToken';

const sessionToken = localStorage.getItem(SESSION_TOKEN_STORAGE_NAME);

const INITIAL_STATE = {
  sessionToken,
  status: AUTH_STATE.SESSION_REQUIRED
};

//
// reducer
//

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SESSION_VALIDATE_REQUEST:
      return {
        ...state,
        status: AUTH_STATE.SESSION_LOADING
      };
    case SESSION_VALIDATE_SUCCESS:
      return {
        ...state,
        status: AUTH_STATE.SESSION_VALID,
        session: action.payload
      };
    case SESSION_VALIDATE_FAILURE:
      return {
        ...state,
        status: AUTH_STATE.SESSION_REQUIRED
      };
    case SESSION_CREATE_SUCCESS:
      return {
        ...state,
        status: AUTH_STATE.SESSION_VALID,
        sessionToken: action.payload.Token,
        session: action.payload
      };
    case SESSION_CLOSE_REQUEST:
      return {
        ...state,
        status: AUTH_STATE.SESSION_LOADING
      };

    default:
      return state;
  }
};

reducer.getSessionToken = state => state.auth.sessionToken;
reducer.getAuthStatus = state => state.auth.status;
reducer.getUserId = state => state.auth.session && state.auth.session.UserId;

export default reducer;

//
// actions
//

export const validateSession = (() => {
  const request = {
    type: SESSION_VALIDATE_REQUEST
  };

  const requestSuccess = payload => ({
    type: SESSION_VALIDATE_SUCCESS,
    payload
  });

  const requestFailure = payload => ({
    type: SESSION_VALIDATE_FAILURE,
    payload
  });

  return () => (dispatch, getState) => {
    const sessionToken = reducer.getSessionToken(getState());

    if (!sessionToken) {
      return;
    }

    dispatch(request);

    return apiCall({
      url: '/OpenApi/sessions/current',
      secure: false,
      headers: {
        Authorization: `Bearer ${sessionToken}`
      }
    }).then(
      payload => dispatch(requestSuccess(payload)),
      payload => {
        localStorage.removeItem(SESSION_TOKEN_STORAGE_NAME);
        dispatch(requestFailure(payload));
      }
    );
  };
})();

export const createSession = (() => {
  const request = {
    type: SESSION_CREATE_REQUEST
  };

  const requestSuccess = payload => ({
    type: SESSION_CREATE_SUCCESS,
    payload
  });

  return (login, password) => dispatch => {
    dispatch(request);

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
      localStorage.setItem(SESSION_TOKEN_STORAGE_NAME, payload.Token);
      dispatch(requestSuccess(payload));
    });
  };
})();

export const closeSession = (() => {
  const request = {
    type: SESSION_CLOSE_REQUEST
  };

  const shutdown = () => {
    localStorage.removeItem(SESSION_TOKEN_STORAGE_NAME);
    location.reload();
  };

  return () => dispatch => {
    dispatch(request);

    return apiCall({
      url: '/OpenApi/sessions',
      method: 'DELETE'
    }).then(shutdown, shutdown);
  };
})();
