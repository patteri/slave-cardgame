import axios from 'axios';

const api = {
  startGame: () => axios.post('/api/game'),
  hit: (gameId, data) => axios.post('/api/game/' + gameId + '/hit', data),
  getCardExchange: (gameId, clientId) => axios.get('/api/game/' + gameId + '/cardExchange?clientId=' + clientId),
  cardsForExchange: (gameId, data) => axios.post('/api/game/' + gameId + '/cardsForExchange', data)
};

export default api;
