import { createStore, compose } from 'redux';
import { install as installReduxLoop } from 'redux-loop';

export const configureStore = (reducer, _composeEnhancer, initialState) => {
  const composeEnhancer = _composeEnhancer || compose;
  return createStore(
    reducer,
    initialState,
    composeEnhancer(installReduxLoop())
  );
};
