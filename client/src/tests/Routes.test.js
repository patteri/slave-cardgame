import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import Routes from '../routes';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Routes history={browserHistory} />, div);
});
