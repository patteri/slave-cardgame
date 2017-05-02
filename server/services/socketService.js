const Socket = require('socket.io');
const { SocketInfo } = require('../../client/src/shared/constants');

class SocketService {

  constructor() {
    this._sockets = new Map();
  }

  // Initializes the websocket connections
  initialize(server) {
    this._sockets.set('playRoom', new Socket(server, { path: SocketInfo.playRoomSocketUrl }));
    this._sockets.set('game', new Socket(server, { path: SocketInfo.gameSocketUrl }));
  }

  // Gets a socket with the specified id
  // Returns null if the socket doesn't exist
  getSocket(id) {
    if (!this._sockets.has(id)) {
      return null;
    }
    return this._sockets.get(id);
  }

  emitToRoom(socketId, roomId, eventName, data) {
    if (this._sockets.has(socketId)) {
      this._sockets.get(socketId).sockets.in(roomId).emit(eventName, data);
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
