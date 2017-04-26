//  enable runtime transpilation to use ES6/7 in node

var fs = require('fs');

process.env.NODE_ENV = 'development';

var babelrc = fs.readFileSync('./.babelrc');
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-register')(config);

require('../config/polyfills');

require('../src/server.js');
