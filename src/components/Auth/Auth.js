import React, { Component } from 'react';

export default class Auth extends Component {
  render() {
    return (
      <div className="auth">
        {this.props.children}
      </div>
    );
  }
}
