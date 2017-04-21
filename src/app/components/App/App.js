import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import { Auth } from 'auth';
import { User } from 'user';

const App = () => {
  return (
    <div className="app">
      <Auth>
        <Switch>
          <Route path="/" component={User} />
        </Switch>
      </Auth>
    </div>
  );
};

export default App;
