import axios from 'axios';

const api = {
  startGame: () => axios.post('/api/game'),
  hit: (gameId, data) => axios.post('/api/game/' + gameId + '/hit', data)
};

export default api;
