import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import reducer, { fetchProfile } from '../../reducer';
import User from './User';
import { actions as authActions } from 'auth';

const { closeSession } = authActions;

class UserContainer extends Component {
  componentWillMount() {
    if (!this.props.isLoaded) {
      this.props.fetchProfile();
    }
  }

  render() {
    if (this.props.isFetching) {
      return <div className="loading">Loading...</div>;
    }

    return <User {...this.props} />;
  }
}

export default connect(
  (state, ownProps) => {
    return {
      isLoaded: reducer.getIsLoaded(state),
      isFetching: reducer.getIsFetching(state),
      firstName: reducer.getUserAttr(state, 'FirstName'),
      lastName: reducer.getUserAttr(state, 'LastName')
    };
  },
  dispatch => bindActionCreators({ fetchProfile, closeSession }, dispatch)
)(UserContainer);
