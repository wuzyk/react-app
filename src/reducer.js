import { combineReducers } from 'redux';

export default combineReducers(
  allReducers(require.context('.', true, /^\.\/[^/]*\/reducer\.js$/))
);

function allReducers(requireContext) {
  return requireContext.keys().reduce((reducers, reducer) => {
    const featureName = reducer.split('/')[1];
    return {
      ...reducers,
      [featureName]: requireContext(reducer).default
    };
  }, {});
}
