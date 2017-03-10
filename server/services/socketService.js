const Socket = require('socket.io');

class SocketService {

  constructor() {
    this._socket = null;
  }

  // Initializes the websocket connection
  // Returns the created socket
  initialize(server) {
    this._socket = new Socket(server, { path: '/api/game/socket' });
    return this._socket;
  }

  emit(gameId, eventName, data) {
    if (this._socket) {
      this._socket.sockets.in(gameId).emit(eventName, data);
    }
  }
}

const socketService = new SocketService();

module.exports = socketService;
