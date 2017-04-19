import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { createSession } from '../../reducer';
import SigninForm from './Signin';

class SigninFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      validationErrors: {}
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <SigninForm
        onSubmit={this.onSubmit}
        onInputChange={this.onChange}
        isProcessing={this.props.isProcessing}
        signinError={this.props.signinError}
        validationErrors={this.state.validationErrors}
      />
    );
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.validate() === true) {
      const { login, password } = this.state.fields;
      this.props.createSession({ login, password });
    }
  }

  validate() {
    const { login, password } = this.state.fields;
    let error;

    if (!login) {
      error = { login: 'Enter login' };
    }

    if (!password) {
      error = { password: 'Enter password' };
    }

    this.setState(() => ({
      validationErrors: error || {}
    }));

    return error === undefined;
  }

  onChange(event) {
    const { target } = event;
    this.setState(state => ({
      fields: {
        ...state.fields,
        [target.name]: target.value
      }
    }));
  }
}

export default connect(
  state => ({
    signinError: reducer.getError(state),
    isProcessing: reducer.getIsLoggining(state)
  }),
  dispatch => bindActionCreators({ createSession }, dispatch)
)(SigninFormContainer);
