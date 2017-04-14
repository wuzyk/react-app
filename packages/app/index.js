import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { AuthRoute, PrivateRoute, AuthPage } from 'auth/index.js';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          <AuthRoute path="/auth" redirect="/" component={AuthPage} />
          <PrivateRoute path="/" redirect="/auth">

          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
