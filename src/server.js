import Express from 'express';
import http from 'http';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './Html.js';
import App from './app/components/App/App';

const app = new Express();
const server = new http.Server(app);

app.use((req, res) => {
  res.send(
    '<!doctype html>\n' + ReactDOM.renderToString(<Html component={App} />)
  );
});

server.listen(3000, err => {
  if (err) {
    console.error(err);
  }
  console.info('Server is running');
});
