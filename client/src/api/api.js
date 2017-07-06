import axios from 'axios';
import setHttpInterceptors from './interceptors';

setHttpInterceptors();

const authApi = {
  login: data => axios.post('/api/auth/login', data),
  register: data => axios.post('/api/auth/register', data),
  activate: data => axios.post('/api/auth/activate', data),
  forgot: data => axios.post('/api/auth/forgot', data),
  renew: data => axios.post('/api/auth/renew', data),
  usernameAvailable: username => axios.get(`/api/auth/usernameAvailable?username=${username}`)
};

const gameApi = {
  createGame: data => axios.post('/api/game', data),
  joinGame: (gameId, data) => axios.post(`/api/game/${gameId}/join`, data),
  quitGame: (gameId, data) => axios.post(`/api/game/${gameId}/quit`, data),
  hit: (gameId, data) => axios.post(`/api/game/${gameId}/hit`, data),
  getCardExchange: (gameId, clientId) => axios.get(`/api/game/${gameId}/cardExchange?clientId=${clientId}`),
  cardsForExchange: (gameId, data) => axios.post(`/api/game/${gameId}/cardsForExchange`, data)
};

const statsApi = {
  getStats: (properties, limit) => {
    const limitParam = limit ? `&limit=${limit}` : '';
    return axios.get(`/api/stats?properties=${properties.join(',')}${limitParam}`);
  },
  getByUsername: username => axios.get(`/api/stats/${username}`)
};

export default {
  auth: authApi,
  game: gameApi,
  stats: statsApi
};
