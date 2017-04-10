import React, { Component } from 'react';

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        {this.props.children}
      </div>
    );
  }
}
