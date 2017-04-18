import { createStore, compose } from 'redux';
import { install as installReduxLoop } from 'redux-loop';
import reducer from './reducer';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancer(installReduxLoop());

const store = createStore(reducer, enhancer);

export default store;
