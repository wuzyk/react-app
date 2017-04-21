import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';

export default class Html extends Component {
  render() {
    const { component: Component } = this.props;

    const content = Component ? ReactDOM.renderToString(<Component />) : '';

    return (
      <html lang="en-us">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }} />
          <script src="static/js/bundle.js" charSet="UTF-8" />
        </body>
      </html>
    );
  }
}
