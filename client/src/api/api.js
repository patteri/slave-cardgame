import axios from 'axios';

const api = {
  createGame: data => axios.post('/api/game', data),
  joinGame: (gameId, data) => axios.post('/api/game/' + gameId + '/join', data),
  hit: (gameId, data) => axios.post('/api/game/' + gameId + '/hit', data),
  getCardExchange: (gameId, clientId) => axios.get('/api/game/' + gameId + '/cardExchange?clientId=' + clientId),
  cardsForExchange: (gameId, data) => axios.post('/api/game/' + gameId + '/cardsForExchange', data)
};

export default api;
