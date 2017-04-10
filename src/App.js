import React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AuthRoute } from './services/auth';
import Auth from './components/Auth/Auth';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Signin from './scenes/Signin/Signin';
import Signup from './scenes/Signup/Signup';
import Main from './scenes/Main/Main';

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <AuthRoute path="/auth" redirect="/" isPublic>
              <Auth>
                <Switch>
                  <Route path="/auth/signup" component={Signup} />
                  <Route path="/auth" component={Signin} />
                </Switch>
              </Auth>
            </AuthRoute>
            <AuthRoute path="/" redirect="/auth">
              <Dashboard>
                <Route exact path="/" component={Main} />
              </Dashboard>
            </AuthRoute>
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default App;

