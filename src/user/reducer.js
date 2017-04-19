import * as api from './api';
import { createReducer, createAction } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import { sessionReceived } from 'auth/reducer';

//
// actions
//

export const fetchProfile = createAction('start fetching profile');
export const fetchProfileSuccess = createAction('fetch profile success');
export const fetchProfileFailure = createAction('fetch profile failure');

const fetchProfileApiCall = userId => {
  return api
    .fetchProfile(userId)
    .then(fetchProfileSuccess, fetchProfileFailure);
};

//
// reducer
//

const INITIAL_STATE = {
  isFetching: false,
  userId: null,
  data: {},
  attrsByType: {}
};

const reducer = createReducer(
  {
    [sessionReceived]: (state, payload) => ({
      ...state,
      userId: payload.UserId
    }),
    [fetchProfile]: state => {
      return loop(
        { ...state, isFetching: true },
        Effects.promise(fetchProfileApiCall, state.userId)
      );
    },
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

reducer.getIsFetching = state => state.user.isFetching;
reducer.getUserAttr = (state, attrType) => {
  const attr = state.user.attrsByType[attrType];
  return attr && (attr.DisplayValue || attr.RawValue);
};

export default reducer;
