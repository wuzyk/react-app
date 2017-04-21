import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import store from './store';
import App from './app/components/App/App';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router>
          <Component />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app/components/App/App', () => {
    const NextApp = require('./app/components/App/App').default;
    render(NextApp);
  });
}
