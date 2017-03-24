import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import io from 'socket.io-client';
import OtherPlayers from './OtherPlayers';
import Table from './Table';
import Player from './Player';
import ResultsModal from './ResultsModal';

const socket = io('', { path: '/api/game/socket' });

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.gameEnded = this.gameEnded.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    // Load initial game
    this.props.requestGame();
  }

  componentDidUpdate(prevProps) {
    // Configure websocket after game was loaded
    if (prevProps.gameId == null && this.props.gameId) {
      socket.emit('joinGame', this.props.gameId, this.props.playerId);
      socket.on('turnChanged', this.props.onTurnChange);
      socket.on('gameEnded', this.gameEnded);
      socket.on('cardsExchanged', this.props.onCardsExchanged);
      socket.on('newRoundStarted', this.props.onNewRoundStarted);
    }
  }

  componentWillUnmount() {
    socket.close();
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
    this.props.requestCardExchange();
  }

  render() {
    const { otherPlayers, table, isRevolution, player, results, helpText } = this.props;

    return (
      <Grid className="Game" fluid>
        <ResultsModal results={results} show={this.state.showModal} onHide={this.hideModal} />
        <OtherPlayers players={otherPlayers} />
        <div className="Game-table">
          <div className="Game-direction">
            {!isRevolution && <img src="/images/clockwise.png" alt="Clockwise" />}
            {isRevolution && <img src="/images/counterclockwise.png" alt="Revolution" />}
          </div>
          <Table table={table} />
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
  otherPlayers: PropTypes.array,
  table: PropTypes.array,
  isRevolution: PropTypes.bool,
  player: PropTypes.object,
  results: PropTypes.array,
  helpText: PropTypes.string
};

export default Game;
