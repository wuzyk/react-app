import { apiCall } from 'api';
import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';

//
// actions
//

const fetchProfile = createAction('start fetching profile');
const fetchProfileSuccess = createAction('fetch profile success');
const fetchProfileFailure = createAction('fetch profile failure');

const fetchProfileApiCall = () => {
  return apiCall({
    url: '/OpenApi/profile'
  }).then(fetchProfileSuccess, fetchProfileFailure);
};

export { fetchProfile };

//
// reducer
//

const INITIAL_STATE = {
  isFetching: false,
  data: {},
  attrsByType: {}
};

const reducer = createReducer(
  {
    [fetchProfile]: state =>
      loop(
        {
          ...state,
          isFetching: true
        },
        Effects.promise(fetchProfileApiCall)
      ),
    [fetchProfileSuccess]: (state, payload) => ({
      ...state,
      isFetching: false,
      data: payload,
      attrsByType: payload.UserAttributes.reduce((result, attr) => {
        result[attr.UserAttributeTypeId] = attr;
        return result;
      }, {})
    }),
    [fetchProfileFailure]: state => ({
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
