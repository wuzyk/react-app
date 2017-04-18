//import { applyMiddleware } from 'redux';
//import thunkMiddleware from 'redux-thunk';
import { createStore } from 'redux';
import { install } from 'redux-loop';
import reducer from './reducer';

const store = createStore(reducer, install());

export default store;
