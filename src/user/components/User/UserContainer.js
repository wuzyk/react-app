import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as auth from 'auth';
import reducer, { fetchProfile } from '../../reducer';
import User from './User';

const { closeSession } = auth.actions;

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
  state => ({
    isFetching: reducer.getIsFetching(state),
    firstName: reducer.getUserAttr(state, 'FirstName'),
    lastName: reducer.getUserAttr(state, 'LastName')
  }),
  dispatch => bindActionCreators({ fetchProfile, closeSession }, dispatch)
)(UserContainer);
