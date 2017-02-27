import React, { Component } from 'react';
import { Grid, Button } from 'react-bootstrap';
import _ from 'lodash';
import api from '../../api/api';
import Card from '../../../../models/card';
import './style.css';

class Game extends Component {

  constructor(props) {
    super(props);

    this.state = {
      player: null,
      cards: null,
      game: null,
      table: null
    };

    this.loadInitialGame();

    this.hitCard = this.hitCard.bind(this);
  }

  loadInitialGame() {
    this.state = api.startGame().then((response) => {
      this.setState({
        player: response.data.player,
        cards: response.data.player.cards.sort(Card.compare),
        game: response.data.game,
        table: _.last(response.data.game.table)
      });
    });
  }

  hitCard(card) {
    api.hit(this.state.game.id, { clientId: this.state.player.id, cards: [ card ] }).then((response) => {
      this.setState({
        cards: response.data.cards.sort(Card.compare)
      });
    });
  }

  render() {
    const { player, cards, game, table } = this.state;

    return (
      <Grid className="Game" fluid>
        {game &&
          <div>
            <ul className="list-unstyled">
              {game.players.map((item, index) => (
                <li key={index}>{game.turn === index && '*'} {item.name} {item.type} {item.cardCount}</li>
              ))}
            </ul>
            <p>* Player in turn</p>
            <div className="Game-table">
              <span className="Game-card">
                {table}
              </span>
            </div>
          </div>
        }
        {player &&
          <div>
            <h2>{player.name}</h2>
            {cards.map((item, index) => (
              <Button className="Game-card" key={index} onClick={() => this.hitCard(item)}>
                {item.suit} {item.value}
              </Button>
            ))}
          </div>
        }
      </Grid>
    );
  }
}

export default Game;
