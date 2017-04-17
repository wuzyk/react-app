import React, { Component } from 'react';
import { connect } from 'react-redux';
import { closeSession } from 'auth/store';
import { fetchProfile } from '../../store';
import store from '../../store';
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
  (state, props) => ({
    isFetching: store.getIsFetching(state),
    firstName: store.getUserAttr(state, 'FirstName'),
    lastName: store.getUserAttr(state, 'LastName')
  }),
  dispatch => ({
    fetchProfile: () => dispatch(fetchProfile()),
    closeSession: () => dispatch(closeSession())
  })
)(UserContainer);
