const Socket = require('socket.io');

class SocketService {

  constructor() {
    this._socket = null;
  }

  // Initializes the websocket connection and events
  initialize(server) {
    this._socket = new Socket(server, { path: '/api/game/socket' });

    this._socket.on('connection', (socket) => {
      socket.on('joinGame', (gameId) => {
        socket.join(gameId);
      });
    });
  }

  emit(gameId, eventName, data) {
    if (this._socket) {
      this._socket.sockets.in(gameId).emit(eventName, data);
    }
  }
}

const socketService = new SocketService();

module.exports = socketService;
