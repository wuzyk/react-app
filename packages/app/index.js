import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthRoute, PrivateRoute, AuthPage } from 'auth';
import { UserPage } from 'user';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          <AuthRoute path="/auth" redirect="/" component={AuthPage} />
          <PrivateRoute path="/" redirect="/auth">
            <Route path="/user" component={UserPage} />
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
