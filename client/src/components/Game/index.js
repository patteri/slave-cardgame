import React, { Component } from 'react';
import { Grid, Button, Row, Col } from 'react-bootstrap';
import io from 'socket.io-client';
import classNames from 'classnames';
import api from '../../api/api';
import Card from '../../../../models/card';
import './style.css';

const socket = io('', { path: '/api/game/socket' });

class Game extends Component {

  constructor(props) {
    super(props);

    this.game = null;
    this.playerIndex = null;
    this.state = {
      player: null,
      cards: null,
      ownTurn: null,
      selectedCards: [],
      table: null,
      otherPlayers: null
    };

    this.loadInitialGame();

    this.turnChanged = this.turnChanged.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.hitCards = this.hitCards.bind(this);
    this.getIndexOfSelected = this.getIndexOfSelected.bind(this);
  }

  getIndexOfSelected(card) {
    return this.state.selectedCards.indexOf(card);
  }

  loadInitialGame() {
    api.startGame().then((response) => {
      this.game = response.data.game;
      this.playerIndex = response.data.playerIndex;
      this.setState({
        player: response.data.player,
        cards: response.data.player.cards.sort(Card.compare),
        ownTurn: response.data.game.players[this.playerIndex].turn,
        table: response.data.game.previousHit,
        otherPlayers: response.data.game.players.filter((player, index) => index !== this.playerIndex)
      });

      socket.emit('joinGame', response.data.game.id);
      socket.on('turn', this.turnChanged);
    });
  }

  turnChanged(data) {
    this.game = data.game;
    this.setState({
      ownTurn: data.game.players[this.playerIndex].turn,
      table: data.game.previousHit,
      otherPlayers: data.game.players.filter((player, index) => index !== this.playerIndex)
    });
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
    this.setState({ selectedCards: selectedCards });
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

  render() {
    const { player, cards, ownTurn, selectedCards, table, otherPlayers } = this.state;

    return (
      <Grid className="Game" fluid>
        {otherPlayers &&
          <div>
            <Row>
              {otherPlayers.map((item, index) => (
                <Col xs={4} key={index}>
                  <h2>{item.turn && '*'} {item.name} {item.isCpu && '(CPU)'}</h2>
                  <p>Cards: {item.cardCount}</p>
                </Col>
              ))}
            </Row>
            <p>* Player in turn</p>
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
        {player &&
          <div>
            <h2>{ownTurn && '*'} {player.name}</h2>
            <Button className="Game-hit-button" onClick={() => this.hitCards()}>
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
