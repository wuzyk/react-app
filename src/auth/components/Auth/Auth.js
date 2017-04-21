import React, { Component } from 'react';

class AuthPage extends Component {
  render() {
    return (
      <div className="auth">
        <h1>Auth</h1>
        12312
        {this.props.children}
      </div>
    );
  }
}

export default AuthPage;
