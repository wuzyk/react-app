import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Auth } from 'auth';
import { UserPage } from 'user';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Auth>
          <Switch>
            <Route path="/" component={UserPage} />
          </Switch>
        </Auth>
      </Router>
    </div>
  );
};

export default App;
