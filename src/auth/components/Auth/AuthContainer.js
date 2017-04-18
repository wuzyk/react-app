import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { AUTH_STATE } from '../../constants';
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
    const { status, children } = this.props;

    if (status === AUTH_STATE.SESSION_LOADING) {
      return <div className="loading">Loading...</div>;
    }

    if (status === AUTH_STATE.SESSION_VALID) {
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
  status: reducer.getAuthStatus(state),
  token: reducer.getSessionToken(state)
}))(Auth);
