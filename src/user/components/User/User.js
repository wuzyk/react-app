import React, { Component } from 'react';
import { Button } from 'ui';

class User extends Component {
  render() {
    const { firstName, lastName } = this.props;
    const name = `${firstName} ${lastName}`;
    return (
      <div>
        <div>{name}</div>
        <Button type="button" onClick={this.props.closeSession}>Logout</Button>
      </div>
    );
  }
}

export default User;
