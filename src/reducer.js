import { combineReducers } from 'redux-loop';

import { reducer as authReducer } from './auth';
import { reducer as userReducer } from './user';

export default combineReducers(
  {
    auth: authReducer,
    user: userReducer
  } //allReducers(require.context('.', true, /^\.\/[^/]*\/reducer\.js$/))
);

/*function allReducers(requireContext) {
  return requireContext.keys().reduce((reducers, reducer) => {
    const featureName = reducer.split('/')[1];
    return {
      ...reducers,
      [featureName]: requireContext(reducer).default
    };
  }, {});
}*/
