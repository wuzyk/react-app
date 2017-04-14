import React, { Component, PropTypes } from 'react';

import { Field, Button } from 'ui';

export class SigninForm extends Component {
  render() {
    const { errors, onSubmit, onInputChange, isFetching } = this.props;

    return (
      <div className="Signin">
        <h2>Signin</h2>
        <form onSubmit={onSubmit}>
          <Field
            name="login"
            label="Login"
            onInput={onInputChange}
            error={errors.login} />
          <Field
            type="password"
            name="password"
            label="Password"
            onInput={onInputChange}
            error={errors.password} />
          {errors.common &&
            <div className="error">{errors.common}</div>
          }
          <Button primary disabled={isFetching}>
            {isFetching ? 'Вхожу...' : 'Войти'}
          </Button>
        </form>
      </div>
    );
  }
}

SigninForm.propTypes = {
  errors: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

SigninForm.defaultProps = {
  errors: {}
}