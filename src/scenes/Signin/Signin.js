import React from 'react';

import Form from './components/Form/Form';

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {}
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    let errors = this.validate();

    if (errors === false) {
      // login
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
      <Form onSubmit={this.onSubmit} onInputChange={this.onChange} errors={this.state.errors}/>
    );
  }
}

export default Signin;

