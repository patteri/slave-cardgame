import axios from 'axios';
import setHttpInterceptors from './interceptors';

setHttpInterceptors();

const authApi = {
  login: data => axios.post('/api/auth/login', data),
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

export default {
  auth: authApi,
  game: gameApi
};
