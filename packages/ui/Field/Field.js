import React, { Component } from 'react';

export class Field extends Component {
  render() {
    const { name, label, value, error, ...restProps } = this.props;

    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <input type="text" id={name} name={name} {...restProps} />
        {error &&
          <div className="error">{error}</div>
        }
      </div>
    );
  }
}
