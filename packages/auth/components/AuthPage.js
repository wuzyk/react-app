import React, { Component } from 'react';

export class AuthPage extends Component {
  render() {
    return (
      <div className="auth">
        <h1>Auth</h1>
        {this.props.children}
      </div>
    );
  }
}
