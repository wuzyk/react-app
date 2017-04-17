import { apiCall } from 'api';

const USER_FETCH_REQUEST = 'auth/USER_FETCH_REQUEST';
const USER_FETCH_SUCCESS = 'auth/USER_FETCH_SUCCESS';
const USER_FETCH_FAILURE = 'auth/USER_FETCH_FAILURE';

const INITIAL_STATE = {
  isFetching: false,
  data: {},
  attrsByType: {}
};

//
// reducer
//

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case USER_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload,
        attrsByType: action.payload.UserAttributes.reduce((result, attr) => {
          result[attr.UserAttributeTypeId] = attr;
          return result;
        }, {})
      };
    case USER_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

reducer.getUserAttr = (state, attrType) => {
  const attr = state.user.attrsByType[attrType];
  return attr && (attr.DisplayValue || attr.RawValue);
};
reducer.getIsFetching = state => state.user.isFetching;

export default reducer;

//
// actions
//

export const fetchProfile = (() => {
  const request = {
    type: USER_FETCH_REQUEST
  };

  const requestSuccess = payload => ({
    type: USER_FETCH_SUCCESS,
    payload
  });

  const requestFailure = payload => ({
    type: USER_FETCH_FAILURE,
    payload
  });

  return () => (dispatch, getState) => {
    dispatch(request);

    return apiCall({
      url: '/OpenApi/profile'
    }).then(
      payload => dispatch(requestSuccess(payload)),
      payload => dispatch(requestFailure(payload))
    );
  };
})();
