import React from 'react';
import { connect } from 'react-redux';
import reducer, { createSession } from '../../reducer';
import SigninForm from './Signin';

class SigninFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      isFetching: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    let errors = this.validate();

    if (errors === false) {
      const { login, password } = this.state.fields;

      this.setState(() => ({
        isFetching: true
      }));

      this.props.dispatch(createSession({ login, password })).catch(error => {
        debugger;
        this.setState(() => ({
          isFetching: false,
          errors: { common: error.message }
        }));
      });
    } else {
      this.setState(() => ({
        errors
      }));
    }
  }

  validate() {
    const { login, password } = this.state.fields;

    if (!login) {
      return { login: 'Enter login' };
    }

    if (!password) {
      return { password: 'Enter password' };
    }

    return false;
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

  render() {
    return (
      <SigninForm
        onSubmit={this.onSubmit}
        onInputChange={this.onChange}
        errors={this.state.errors}
        isFetching={this.state.isFetching}
      />
    );
  }
}

export default connect(state => ({
  error: reducer.getError(state),
  isCreating: reducer.getIsCreating(state)
}))(SigninFormContainer);
