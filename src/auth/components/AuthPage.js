import React, { Component } from 'react';

class AuthPage extends Component {
  render() {
    return (
      <div className="auth">
        <h1>Auth11123</h1>
        {this.props.children}
      </div>
    );
  }
}

export default AuthPage;
