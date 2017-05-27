import React, { PropTypes } from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Root from './components/Root';
import Home from './components/Home';
import Join from './components/Join';
import Game from './components/Game';
import Stats from './components/Stats';

const Routes = props => (
  <Provider store={props.store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="home" />
      <Route path="/" component={Root}>
        <Route path="home" component={Home} />
        <Route path="join/:id" component={Join} />
        <Route path="stats" component={Stats} />
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
