import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect';

import Root from './components/Root';
import Home from './components/Home';
import Register from './components/Register';
import Activate from './components/Register/Activate';
import Login from './components/Login';
import Forgot from './components/Password/Forgot';
import Renew from './components/Password/Renew';
import Profile from './components/Profile';
import Join from './components/Join';
import Game from './components/Game';
import Stats from './components/Stats';
import Rules from './components/Rules';

const checkAuth = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.username != null,
  allowRedirectBack: false,
  wrapperDisplayName: 'CheckAuth'
});

const Routes = props => (
  <Provider store={props.store}>
    <Router history={browserHistory}>
      <Route path="/" component={Root}>
        <IndexRoute component={Home} />
        <Route path="register" component={Register} />
        <Route path="activate/:token" component={Activate} />
        <Route path="login" component={Login} />
        <Route path="forgot" component={Forgot} />
        <Route path="renew/:token" component={Renew} />
        <Route path="profile" component={checkAuth(Profile)} />
        <Route path="join/:id" component={Join} />
        <Route path="stats" component={Stats} />
        <Route path="rules" component={Rules} />
      </Route>
      <Route path="game" component={Game} />
      <Redirect from="/*" to="/" />
    </Router>
  </Provider>
);

Routes.propTypes = {
  store: PropTypes.object.isRequired
};

export default Routes;
