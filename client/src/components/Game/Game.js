import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Grid, Col, ControlLabel, FormControl } from 'react-bootstrap';
import io from 'socket.io-client';
import OtherPlayers from './OtherPlayers';
import Table from './Table';
import Player from './Player';
import Chat from '../Chat';
import ResultsModal from './ResultsModal';
import { GameState, SocketInfo } from '../../shared/constants';

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      showModal: false,
      joinUrl: ''
    };

    this.gameEnded = this.gameEnded.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleJoinUrlFocus = this.handleJoinUrlFocus.bind(this);
  }

  componentWillMount() {
    if (this.props.gameId) {
      // Configure websocket
      const socket = io('', { path: SocketInfo.gameSocketUrl });
      socket.on('playerJoined', this.props.onPlayerJoined);
      socket.on('gameStarted', this.props.onGameStarted);
      socket.on('gameUpdated', this.props.onGameUpdated);
      socket.on('gameEnded', this.gameEnded);
      socket.on('cardsExchanged', this.props.onCardsExchanged);
      socket.on('newRoundStarted', this.props.onNewRoundStarted);
      socket.emit('joinGame', this.props.gameId, this.props.playerId);

      this.setState({
        socket: socket,
        joinUrl: window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) +
          'join/' + this.props.gameId
      });
    }
    else {
      browserHistory.push('/home');
    }
  }

  componentWillUnmount() {
    if (this.state.socket) {
      this.state.socket.close();
    }
  }

  gameEnded(data) {
    this.props.onGameEnd(data);

    setTimeout(() => {
      this.showModal();
    }, 1000);
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  hideModal() {
    this.setState({
      showModal: false
    });

    if (this.props.results.gameNumber < this.props.results.totalGameCount) {
      this.props.requestCardExchange();
    }
    else {
      browserHistory.push('/home');
    }
  }

  handleJoinUrlFocus(e) {
    e.target.select();
  }

  render() {
    const { gameId, playerCount, gameState, otherPlayers, table, isRevolution, player, results, helpText } = this.props;

    return (
      <Grid className="Game" fluid>
        <Chat socket={this.state.socket} gameId={gameId} />
        {results &&
          <ResultsModal results={results} show={this.state.showModal} onHide={this.hideModal} />
        }
        <OtherPlayers playerCount={playerCount} players={otherPlayers} />
        <div className="Game-table">
          {gameState === GameState.NOT_STARTED &&
            <div>
              <Col componentClass={ControlLabel} sm={6} md={3} mdOffset={3}>
                Share this link to your friends, so they can join the game!
              </Col>
              <Col sm={6} md={3}>
                <FormControl type="text" value={this.state.joinUrl} readOnly onFocus={this.handleJoinUrlFocus} />
              </Col>
            </div>
          }
          {gameState !== GameState.NOT_STARTED &&
            <div>
              <div className="Game-direction">
                {!isRevolution && <img src="/images/clockwise.png" alt="Clockwise" />}
                {isRevolution && <img src="/images/counterclockwise.png" alt="Revolution" />}
              </div>
              <Table table={table} />
            </div>
          }
        </div>
        {helpText && <p>{helpText}</p>}
        {player.player &&
          <Player {...player} onHit={this.props.onCardsHit} onCardsChange={this.props.onCardSelectionChange} />
        }
      </Grid>
    );
  }
}

Game.propTypes = {
  playerCount: PropTypes.number,
  otherPlayers: PropTypes.array,
  table: PropTypes.array,
  isRevolution: PropTypes.bool,
  player: PropTypes.object,
  results: PropTypes.object,
  helpText: PropTypes.string
};

export default Game;
