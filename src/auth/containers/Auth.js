import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { setApiToken } from 'api';

import reducer from '../redux/reducer';
import AuthPage from '../components/AuthPage';
import Signin from './Signin';

const SESSION_TOKEN_STORAGE_KEY = 'sessionToken';

class Auth extends Component {
  componentWillMount() {
    const { token } = this.props;

    if (token) {
      setApiToken(token);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.token !== props.token) {
      setApiToken(props.token);
      this.props.cookies.set(SESSION_TOKEN_STORAGE_KEY, props.token || '');
    }
  }

  render() {
    const { token, isLoading, children } = this.props;

    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (token) {
      return children;
    }

    return (
      <AuthPage>
        <Switch>
          <Route path="/signup" component={Signin} />
          <Route path="/" component={Signin} />
        </Switch>
      </AuthPage>
    );
  }
}

export default withCookies(
  connect(state => ({
    isLoading: reducer.getIsLoading(state),
    token: reducer.getSessionToken(state)
  }))(Auth)
);
