import httpProxyMiddleware from 'http-proxy-middleware';
import historyApiFallback from 'connect-history-api-fallback';
import cookiesMiddleware from 'universal-cookie-express';
import Express from 'express';

const app = new Express();

app.use('/public', Express.static(__dirname + '/../public'));

//
// proxy
//
const proxy = 'https://www.walletone.com';

app.use(
  historyApiFallback({
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebookincubator/create-react-app/issues/387.
    disableDotRule: true,
    // For single page apps, we generally want to fallback to /index.html.
    // However we also want to respect `proxy` for API calls.
    // So if `proxy` is specified, we need to decide which fallback to use.
    // We use a heuristic: if request `accept`s text/html, we pick /index.html.
    // Modern browsers include text/html into `accept` header when navigating.
    // However API calls like `fetch()` won’t generally accept text/html.
    // If this heuristic doesn’t work well for you, don’t use `proxy`.
    htmlAcceptHeaders: proxy ? ['text/html'] : ['text/html', '*/*']
  })
);

if (proxy) {
  var mayProxy = /^\/OpenApi\/.*$/;

  // Pass the scope regex both to Express and to the middleware for proxying
  // of both HTTP and WebSockets to work without false positives.
  var hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
    target: proxy,
    logLevel: 'silent',
    onProxyReq: function(proxyReq) {
      // Browers may send Origin headers even with same-origin
      // requests. To prevent CORS issues, we have to change
      // the Origin to match the target URL.
      if (proxyReq.getHeader('origin')) {
        proxyReq.setHeader('origin', proxy);
      }
    },
    onError: function(error) {
      console.log(error);
    },
    secure: false,
    changeOrigin: true,
    ws: true,
    xfwd: true
  });

  app.use(mayProxy, hpm);
}

//
// webpack middleware
//
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config.dev');
const webpackCompiler = webpack(webpackConfig);

app.use(
  require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    serverSideRender: true,
    stats: {
      colors: true
    }
  })
);

app.use(require('webpack-hot-middleware')(webpackCompiler));

webpackCompiler.plugin('done', function() {
  Object.keys(require.cache).forEach(function(id) {
    if (!/node_modules/.test(id) && /[\\/]src[\\/].*/.test(id)) {
      delete require.cache[id];
    }
  });
});

//
//  process request
//

app.use(cookiesMiddleware());

app.use(function(req, res) {
  require('./html')(req.originalUrl, req.universalCookies).then(content =>
    res.send(content)
  );
});

app.listen(3000, err => {
  if (err) {
    console.error(err);
  }
  console.info('Server is running');
});
