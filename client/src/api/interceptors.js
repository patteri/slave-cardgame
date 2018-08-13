import axios from 'axios';
import { loadState } from '../utils/webStorage';
import store from '../store';
import { logout } from '../components/Login/actions';

const setHttpInterceptors = () => {
  axios.interceptors.request.use((config) => {
    const state = loadState(localStorage, 'autoSave');

    if (state && state.auth && state.auth.token) {
      config.headers['X-Access-Token'] = state.auth.token;
    }

    return config;
  }, err => Promise.reject(err));

  axios.interceptors.response.use(response => response,
    (err) => {
      if (err.response && err.response.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(err);
    }
  );
};

export default setHttpInterceptors;
