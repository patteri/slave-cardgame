import React, { Component } from 'react';
import { Grid, Button, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import classNames from 'classnames';
import api from '../../api/api';
import Card from '../../../../models/card';
import CardHelper from '../../../../helpers/cardHelper';
import './style.css';

const socket = io('', { path: '/api/game/socket' });

class Game extends Component {

  constructor(props) {
    super(props);

    this.game = null;
    this.state = {
      player: null,
      playerIndex: null,
      cards: null,
      selectedCards: [],
      canHit: false,
      table: null,
      players: null,
      isRevolution: false
    };

    this.loadInitialGame();

    this.turnChanged = this.turnChanged.bind(this);
    this.gameEnded = this.gameEnded.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.hitCards = this.hitCards.bind(this);
    this.getIndexOfSelected = this.getIndexOfSelected.bind(this);
    this.canHit = this.canHit.bind(this);
  }

  getIndexOfSelected(card) {
    return this.state.selectedCards.indexOf(card);
  }

  getStatus(status) {
    return <p className={'Game-status ' + status}>{status}</p>;
  }

  loadInitialGame() {
    api.startGame().then((response) => {
      this.game = response.data.game;
      this.setState({
        player: response.data.player,
        playerIndex: response.data.playerIndex,
        cards: response.data.player.cards.sort(Card.compare),
        table: response.data.game.previousHit,
        players: response.data.game.players,
        isRevolution: response.data.game.isRevolution
      });

      socket.emit('joinGame', response.data.game.id);
      socket.on('turnChanged', this.turnChanged);
      socket.on('gameEnded', this.gameEnded);
    });
  }

  turnChanged(data) {
    this.game = data.game;
    this.setState({
      canHit: this.canHit(data.game.players, this.state.selectedCards, data.game.previousHit),
      table: data.game.previousHit,
      players: data.game.players,
      isRevolution: data.game.isRevolution
    });
  }

  gameEnded(data) {
    this.turnChanged(data);
    // For the moment, just print out the results
    console.log(data.results); // eslint-disable-line no-console
  }

  selectCard(card) {
    let selectedCards = this.state.selectedCards.slice();
    let index = this.getIndexOfSelected(card);
    if (index === -1) {
      if (selectedCards.length > 0 && selectedCards[0].value !== card.value) {
        selectedCards = [];
      }
      selectedCards.push(card);
    }
    else {
      selectedCards.splice(index, 1);
    }
    this.setState({
      canHit: this.canHit(this.state.players, selectedCards, this.state.table),
      selectedCards: selectedCards
    });
  }

  hitCards() {
    api.hit(this.game.id, {
      clientId: this.state.player.id,
      cards: this.state.selectedCards
    }).then((response) => {
      this.setState({
        cards: response.data.cards.sort(Card.compare),
        selectedCards: []
      });
    });
  }

  canHit(players, selectedCards, table) {
    // Must be player's turn and valid cards selected
    let hasTurn = players[this.state.playerIndex].turn;
    let isValid = CardHelper.validateHit(selectedCards, table, this.game.isFirstTurn, this.game.isRevolution);
    return hasTurn && isValid;
  }

  render() {
    const { player, playerIndex, cards, canHit, selectedCards, table, players, isRevolution } = this.state;

    return (
      <Grid className="Game" fluid>
        {players &&
          <div>
            <Row>
              {players.filter((player, index) => index !== playerIndex).map((item, index) => (
                <Col xs={4} key={index}>
                  <h2 className={classNames('Game-player-name', { turn: item.turn })}>
                    {item.name} {item.isCpu && '(CPU)'}
                  </h2>
                  <p>Cards: {item.cardCount}</p>
                  {this.getStatus(item.status)}
                </Col>
              ))}
            </Row>
            <div className="Game-table">
              {table &&
                <div>
                  {table.map((item, index) => (
                    <Button className="Game-card" key={index}>{item.suit} {item.value}</Button>
                  ))}
                </div>
              }
            </div>
          </div>
        }
        {isRevolution && <p className="Game-revolution">REVOLUTION</p>}
        {player &&
          <div>
            <h2 className={classNames('Game-player-name', { turn: players[playerIndex].turn })}>
              {player.name}
            </h2>
            {this.getStatus(players[playerIndex].status)}
            <Button className="Game-hit-button" onClick={() => this.hitCards()} disabled={!canHit}>
              {selectedCards.length > 0 ? 'Hit' : 'Pass'}
            </Button>
            <div>
              {cards.map((item, index) => (
                <Button
                  className={classNames('Game-card', { selected: this.getIndexOfSelected(item) !== -1 })}
                  key={index} onClick={() => this.selectCard(item)}
                >
                  {item.suit} {item.value}
                </Button>
              ))}
            </div>
          </div>
        }
      </Grid>
    );
  }
}

export default Game;
