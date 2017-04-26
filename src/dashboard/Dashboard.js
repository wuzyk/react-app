import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        <span>Dashboard</span>
        <Link to="/user">User</Link>
      </div>
    );
  }
}

export default Dashboard;
