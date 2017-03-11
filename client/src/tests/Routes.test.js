import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from '../store';
import Routes from '../routes';

it('renders without crashing', () => {
  const store = configureStore();

  const div = document.createElement('div');
  ReactDOM.render(<Routes store={store} />, div);
});
