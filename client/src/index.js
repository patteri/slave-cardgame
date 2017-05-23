import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import store from './store';
import Routes from './routes';

ReactDOM.render(
  <Routes store={store} />,
  document.getElementById('root'), // eslint-disable-line no-undef
);
