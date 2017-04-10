import React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Signin from './scenes/Signin/Signin';
import Signup from './scenes/Signup/Signup';
import Main from './scenes/Main/Main';

const isAuthenticated = true;

const AuthRoute = (props) => {
  const { redirect, isPublic, ...restProps } = props;

  return ((isPublic && !isAuthenticated) || (!isPublic && isAuthenticated))
    ? <Route { ...restProps } />
    : <Redirect to={redirect} />
}

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <AuthRoute path="/auth" redirect="/" isPublic >
              <Auth>
                <Redirect from="/" to="/auth/signin" />
                <Route path="/auth/signin" component={Signin} />
                <Route path="/auth/signup" component={Signup} />
              </Auth>
            </AuthRoute>
            <AuthRoute path="/" redirect="/auth">
              <Dashboard>
                <Redirect from="/" to="/dashboard" />
                <Route exact path="/dashboard" component={Main} />
              </Dashboard>
            </AuthRoute>
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default App;

