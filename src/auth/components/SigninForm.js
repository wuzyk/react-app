import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field, Button } from 'ui';

class SigninForm extends Component {
  render() {
    const {
      onSubmit,
      onInputChange,
      isProcessing,
      signinError,
      validationErrors
    } = this.props;

    return (
      <div className="Signin">
        <h2>Signin123111211</h2>
        <form onSubmit={onSubmit}>
          <Field
            name="login"
            label="Login"
            onInput={onInputChange}
            error={validationErrors.login}
            disabled={isProcessing}
          />
          <Field
            type="password"
            name="password"
            label="Password"
            onInput={onInputChange}
            error={validationErrors.password}
            disabled={isProcessing}
          />
          {signinError && <div className="error">{signinError}</div>}
          <Button primary disabled={isProcessing}>
            {isProcessing ? 'Вхожу...' : 'Войти'}
          </Button>
        </form>
      </div>
    );
  }
}

SigninForm.propTypes = {
  validationErrors: PropTypes.object,
  signinError: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

SigninForm.defaultProps = {
  errors: {}
};

export default SigninForm;
