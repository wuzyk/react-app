import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { AuthPage } from './AuthPage';
import { SigninFormContainer } from './SigninFormContainer';

export class AuthPageContainer extends Component {
  render() {
    return (
      <AuthPage>
        <Switch>
          <Route path="/auth/signup" component={SigninFormContainer} />
          <Route path="/auth" component={SigninFormContainer} />
        </Switch>
      </AuthPage>
    );
  }
}
