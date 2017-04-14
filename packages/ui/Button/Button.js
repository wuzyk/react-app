import React, { Component } from 'react';

export class Button extends Component {
  render() {
    const { children, primary, ...props} = this.props;

    const className = 'button' + (primary ? ' button--primary' : '');

    return (
      <button className={className} type="submit" {...props} >
        {children}
      </button>
    );
  }
}
