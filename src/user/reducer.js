import { apiCall } from 'api';
import { createReducer, createAction } from 'redux-act';

const INITIAL_STATE = {
  isFetching: false,
  data: {},
  attrsByType: {}
};

const load = createAction('start fetching profile');
const loadSuccess = createAction('fetch profile success');
const loadFailure = createAction('fetch profile failure');

const reducer = createReducer(
  {
    [load]: state => ({
      ...state,
      isFetching: true
    }),
    [loadSuccess]: (state, payload) => ({
      ...state,
      isFetching: false,
      data: payload,
      attrsByType: payload.UserAttributes.reduce((result, attr) => {
        result[attr.UserAttributeTypeId] = attr;
        return result;
      }, {})
    }),
    [loadFailure]: state => ({
      ...state,
      isFetching: false
    })
  },
  INITIAL_STATE
);

reducer.getUserAttr = (state, attrType) => {
  const attr = state.user.attrsByType[attrType];
  return attr && (attr.DisplayValue || attr.RawValue);
};
reducer.getIsFetching = state => state.user.isFetching;

export default reducer;

//
// actions
//

export const fetchProfile = () => (dispatch, getState) => {
  dispatch(load());

  return apiCall({
    url: '/OpenApi/profile'
  }).then(
    payload => dispatch(loadSuccess(payload)),
    payload => dispatch(loadFailure(payload))
  );
};
