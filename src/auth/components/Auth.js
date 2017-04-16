import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AuthPage from './AuthPage';
import SigninFormContainer from './SigninFormContainer';
import { getSession } from '../store';

class Auth extends Component {
  componentWillMount() {
    const { sessionToken, getSession } = this.props;

    if (sessionToken) {
      getSession(sessionToken);
    }
  }

  render() {
    const { isLoggedIn, isGettingSession, children } = this.props;

    if (isGettingSession) {
      return <div className="loading">Loading...</div>;
    }

    if (isLoggedIn) {
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

export default connect(
  state => {
    const { sessionToken, isLoggedIn, isGettingSession } = state.auth;
    return {
      sessionToken,
      isLoggedIn,
      isGettingSession,
    };
  },
  dispatch => bindActionCreators({ getSession }, dispatch),
)(Auth);
