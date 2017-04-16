import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers(
  allReducers(require.context('.', true, /^\.\/[^/]*\/store\.js$/)),
);

function allReducers(requireContext) {
  console.log(requireContext.keys());
  return requireContext.keys().reduce((reducers, reducer) => {
    const featureName = reducer.split('/')[1];
    return {
      ...reducers,
      [featureName]: requireContext(reducer).default,
    };
  }, {});
}

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;
