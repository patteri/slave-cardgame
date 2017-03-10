import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import io from 'socket.io-client';
import OtherPlayers from './OtherPlayers';
import Table from './Table';
import Player from './Player';
import api from '../../api/api';
import CardHelper from '../../../../common/cardHelper';
import './style.css';

const socket = io('', { path: '/api/game/socket' });

class Game extends Component {

  constructor(props) {
    super(props);

    this.gameId = null;
    this.state = {
      player: null,
      playerIndex: null,
      cards: null,
      selectedCards: [],
      table: [],
      players: [],
      isFirstTurn: true,
      isRevolution: false
    };

    this.loadInitialGame();

    this.turnChanged = this.turnChanged.bind(this);
    this.gameEnded = this.gameEnded.bind(this);
    this.hitCards = this.hitCards.bind(this);
  }

  componentWillUnmount() {
    socket.close();
  }

  loadInitialGame() {
    api.startGame().then((response) => {
      this.gameId = response.data.game.id;
      this.setState({
        player: response.data.player,
        playerIndex: response.data.playerIndex,
        cards: response.data.player.cards.sort(CardHelper.compareCards),
        table: response.data.game.previousHit,
        players: response.data.game.players,
        isFirstTurn: response.data.game.isFirstTurn,
        isRevolution: response.data.game.isRevolution
      });

      socket.emit('joinGame', response.data.game.id, response.data.player.id);
      socket.on('turnChanged', this.turnChanged);
      socket.on('gameEnded', this.gameEnded);
    });
  }

  turnChanged(data) {
    this.setState({
      table: data.game.previousHit,
      players: data.game.players,
      isFirstTurn: data.game.isFirstTurn,
      isRevolution: data.game.isRevolution
    });
  }

  gameEnded(data) {
    this.turnChanged(data);
    // For the moment, just print out the results
    console.log(data.results); // eslint-disable-line no-console
  }

  hitCards(cards, successCallback) {
    api.hit(this.gameId, {
      clientId: this.state.player.id,
      cards: cards
    }).then((response) => {
      this.setState({
        cards: response.data.cards.sort(CardHelper.compareCards)
      });
      successCallback();
    });
  }

  render() {
    const { playerIndex, cards, table, players, isFirstTurn, isRevolution } = this.state;

    return (
      <Grid className="Game" fluid>
        <OtherPlayers players={players.filter((player, index) => index !== playerIndex)} />
        <Table table={table} />
        {isRevolution && <p className="Game-revolution">REVOLUTION</p>}
        {players.length > 0 &&
        <Player
          player={players[playerIndex]} cards={cards} table={table} isFirstTurn={isFirstTurn}
          isRevolution={isRevolution} onHit={this.hitCards}
        />}
      </Grid>
    );
  }
}

export default Game;
