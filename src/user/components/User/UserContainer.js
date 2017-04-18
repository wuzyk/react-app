import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeSession } from 'auth/reducer';
import reducer, { fetchProfile } from '../../reducer';
import User from './User';

class UserContainer extends Component {
  componentWillMount() {
    this.props.fetchProfile();
  }

  render() {
    if (this.props.isFetching) {
      return <div className="loading">Loading...</div>;
    }

    return <User {...this.props} />;
  }
}

export default connect(
  state => {
    return {
      isFetching: reducer.getIsFetching(state),
      firstName: reducer.getUserAttr(state, 'FirstName'),
      lastName: reducer.getUserAttr(state, 'LastName')
    };
  },
  dispatch => bindActionCreators({ fetchProfile, closeSession }, dispatch)
)(UserContainer);
