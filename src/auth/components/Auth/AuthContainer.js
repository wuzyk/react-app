import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import reducer, { validateSession } from '../../reducer';
import AuthPage from './Auth';
import SigninFormContainer from '../Signin/SigninContainer';

class Auth extends Component {
  componentWillMount() {
    const { token, dispatch } = this.props;
    if (token) {
      dispatch(validateSession(token));
    }
  }

  render() {
    const { isValid, isLoading, children } = this.props;

    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (isValid) {
      return children;
    }

    return (
      <AuthPage>
        <Switch>
          <Route path="/signup" component={SigninFormContainer} />
          <Route path="/" component={SigninFormContainer} />
        </Switch>
      </AuthPage>
    );
  }
}

export default connect(state => ({
  isLoading: reducer.getIsLoading(state),
  isValid: reducer.getIsValid(state),
  token: reducer.getSessionToken(state)
}))(Auth);
