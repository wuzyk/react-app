import React from 'react';

import { SigninForm } from './SigninForm';

export class SigninFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      isFetching: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    let errors = this.validate();

    if (errors === false) {
      // login
      this.setState({
        isFetching: true
      })
    }
    else {
      this.setState({
        errors
      });
    }
  }

  validate() {
    const { login, password } = this.state.fields;

    if (!login)
      return { login: 'Enter login' };

    if (!password)
      return { password: 'Enter password' };

    return false;
  }

  onChange(event) {
    const { target } = event;
    this.setState(state => ({
      fields: {
        ...state.fields,
        [target.name]: target.value,
      },
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
