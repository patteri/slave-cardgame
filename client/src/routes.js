import React, { PropTypes } from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Root from './components/Root';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Forgot from './components/Password/Forgot';
import Renew from './components/Password/Renew';
import Join from './components/Join';
import Game from './components/Game';
import Stats from './components/Stats';
import Rules from './components/Rules';

const Routes = props => (
  <Provider store={props.store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="home" />
      <Route path="/" component={Root}>
        <Route path="home" component={Home} />
        <Route path="register" component={Register} />
        <Route path="login" component={Login} />
        <Route path="forgot" component={Forgot} />
        <Route path="renew/:token" component={Renew} />
        <Route path="join/:id" component={Join} />
        <Route path="stats" component={Stats} />
        <Route path="rules" component={Rules} />
      </Route>
      <Route path="game" component={Game} />
      <Redirect from="/*" to="home" />
    </Router>
  </Provider>
);

Routes.propTypes = {
  store: PropTypes.object.isRequired
};

export default Routes;
