import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';
import { validateSession, AUTH_STATE } from '../../store';
import AuthPage from './Auth';
import SigninFormContainer from '../Signin/SigninContainer';

class Auth extends Component {
  componentWillMount() {
    this.props.dispatch(validateSession());
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
  status: store.getAuthStatus(state)
}))(Auth);
