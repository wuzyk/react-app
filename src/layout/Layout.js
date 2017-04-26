import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';

import { Auth } from 'auth';

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <Auth>
          <Switch>
            {routes.map(({ path, loadData, component: Component }) => (
              <Route
                key={path}
                path={path}
                render={() => <Component loadData={loadData} />}
              />
            ))}
          </Switch>
        </Auth>
      </div>
    );
  }
}

export default Layout;
