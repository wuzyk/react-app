import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import reducer from './reducer';
import { configureStore } from './store';
import Layout from './layout/Layout';

const store = configureStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
  window.__INITIAL_STATE__
);

if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(require('./reducer').default);
  });
}

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter history={history}>
        <CookiesProvider>
          <Component />
        </CookiesProvider>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render(Layout);
