import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import io from 'socket.io-client';
import OtherPlayers from './OtherPlayers';
import Table from './Table';
import Player from './Player';

const socket = io('', { path: '/api/game/socket' });

class Game extends Component {

  constructor(props) {
    super(props);

    this.gameEnded = this.gameEnded.bind(this);
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
    }
  }

  componentWillUnmount() {
    socket.close();
  }

  gameEnded(data) {
    this.props.onTurnChange(data);
    // For the moment, just print out the results
    console.log(data.results); // eslint-disable-line no-console
  }

  render() {
    const { otherPlayers, table, isRevolution, player } = this.props;

    return (
      <Grid className="Game" fluid>
        <OtherPlayers players={otherPlayers} />
        <Table table={table} />
        {isRevolution && <p className="Game-revolution">REVOLUTION</p>}
        {player.player &&
          <Player {...player} onHit={this.props.onCardsHit} onCardsChange={this.props.onCardSelectionChange} />
        }
      </Grid>
    );
  }
}

export default Game;
