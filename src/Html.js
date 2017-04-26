import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import reducer from './reducer';
import { configureStore } from './store';
import Layout from './layout/Layout';
import routes from './layout/routes';
import { reducer as authReducer, actions as authActions } from './auth';
import { setApiToken } from './api';

const { validateSession } = authActions;

class Html extends Component {
  render() {
    const { content, state } = this.props;

    return (
      <html lang="en-us">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="public/favicon.ico" />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__INITIAL_STATE__=${state};`
            }}
            charSet="UTF-8"
          />
          <script src="static/js/bundle.js" charSet="UTF-8" />
        </body>
      </html>
    );
  }
}

module.exports = function(location, cookies) {
  return new Promise(resolve => {
    const store = configureStore(reducer);

    const token = cookies.get('sessionToken');

    Promise.resolve(token)
      .then(token => {
        if (token) {
          return store.dispatch(validateSession(token));
        }
      })
      .then(() => {
        const state = store.getState();
        const token = authReducer.getSessionToken(state);

        if (token) {
          setApiToken(token);

          const promises = routes.reduce((result, route) => {
            const match = matchPath(location, route);

            if (match && route.startActions) {
              result.push(
                ...route.startActions.map(action => store.dispatch(action()))
              );
            }
            return result;
          }, []);

          return Promise.all(promises);
        }

        Promise.resolve();
      })
      .then(() => {
        const routerContext = {};

        const content = ReactDOM.renderToString(
          <Provider store={store}>
            <StaticRouter context={routerContext} location={location}>
              <CookiesProvider cookies={cookies}>
                <Layout />
              </CookiesProvider>
            </StaticRouter>
          </Provider>
        );

        const html =
          '<!doctype html>\n' +
          ReactDOM.renderToString(
            <Html content={content} state={JSON.stringify(store.getState())} />
          );

        resolve(html);
      });
  });
};
