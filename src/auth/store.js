const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const GET_SESSION_REQUEST = 'auth/GET_SESSION_REQUEST';
const GET_SESSION_SUCCESS = 'auth/GET_SESSION_SUCCESS';

const INITIAL_STATE = {
  sessionToken: '1123',
  isLoggining: false,
  isGettingSession: false,
  isLoggedIn: false,
};

export const login = (login, password) => dispatch => {
  dispatch(LOGIN_REQUEST);
};

export const getSession = sessionToken => dispatch => {
  dispatch({
    type: GET_SESSION_REQUEST,
  });

  return new Promise(resolve => {
    setTimeout(() => {
      dispatch({
        type: GET_SESSION_SUCCESS,
        response: {
          token: '123',
        },
      });
    }, 5000);
  });
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggining: true,
      };
    case GET_SESSION_REQUEST:
      return {
        ...state,
        isGettingSession: true,
      };
    case GET_SESSION_SUCCESS:
      return {
        ...state,
        isGettingSession: false,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

export default reducer;
