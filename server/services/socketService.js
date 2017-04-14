const Socket = require('socket.io');
const { GameSocketUrl } = require('../../common/constants');

class SocketService {

  constructor() {
    this._socket = null;
  }

  // Initializes the websocket connection
  // Returns the created socket
  initialize(server) {
    this._socket = new Socket(server, { path: GameSocketUrl });
    return this._socket;
  }

  emitToGame(gameId, eventName, data) {
    if (this._socket) {
      this._socket.sockets.in(gameId).emit(eventName, data);
    }
  }

  emitToClient(socket, eventName, data) {
    if (socket) {
      socket.emit(eventName, data);
    }
  }
}

const socketService = new SocketService();

module.exports = socketService;
