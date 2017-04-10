import React, { Component } from 'react';

export default class Form extends Component {
  render() {
    const { errors, onSubmit, onInputChange } = this.props;

    return (
      <div className="Signin">
        <h2>Signin</h2>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="login">Login</label>
            <input type="text" id="login" name="login" onInput={onInputChange} />
            {errors.login &&
              <div className="error">{errors.login}</div>
            }
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onInput={onInputChange} />
            {errors.password &&
              <div className="error">{errors.password}</div>
            }
          </div>
          {errors.common &&
            <div className="error">{errors.common}</div>
          }
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  }
}
