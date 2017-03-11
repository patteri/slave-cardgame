import React, { PropTypes } from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Root from './components/Root';
import Game from './components/Game';
import Home from './components/Home';
import Highscores from './components/Highscores';

const Routes = props => (
  <Provider store={props.store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="home" />
      <Route path="/" component={Root}>
        <Route path="home" component={Home} />
        <Route path="highscores" component={Highscores} />
      </Route>
      <Route path="game" component={Game} />
    </Router>
  </Provider>
);

Routes.propTypes = {
  store: PropTypes.object.isRequired
};

export default Routes;
