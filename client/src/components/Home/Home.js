import React, { Component, PropTypes } from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import NumericSelector from './NumericSelector';
import { GameValidation as gv } from '../../shared/constants';

class Home extends Component {

  createGame(e) {
    e.preventDefault();
    this.props.onCreateGame();
  }

  render() {
    const { playerCount, cpuPlayerCount, gameCount, playerName, isButtonDisabled } = this.props;

    return (
      <div className="Home">
        <h2>Welcome to play Slave!</h2>
        <Row className="Home-game-form">
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            <form onSubmit={e => this.createGame(e)}>
              <FormGroup controlId="numberOfPlayers">
                <ControlLabel>Total number of players ({gv.minPlayerCount} - {gv.maxPlayerCount})</ControlLabel>
                <NumericSelector
                  value={playerCount}
                  min={gv.minPlayerCount}
                  max={gv.maxPlayerCount}
                  onValueChanged={this.props.onPlayerCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="numberOfCpuPlayers">
                <ControlLabel>Number of CPU players</ControlLabel>
                <NumericSelector
                  value={cpuPlayerCount}
                  min={0}
                  max={gv.maxPlayerCount - 1}
                  onValueChanged={this.props.onCpuPlayerCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="numberOfGames">
                <ControlLabel>Number of games to play</ControlLabel>
                <NumericSelector
                  value={gameCount}
                  min={gv.minGameCount}
                  max={gv.maxGameCount}
                  onValueChanged={this.props.onGameCountChanged}
                />
              </FormGroup>
              <FormGroup controlId="playerName">
                <ControlLabel>Player name</ControlLabel>
                <FormControl
                  type="text"
                  value={playerName}
                  required
                  maxLength={12}
                  onChange={e => this.props.onPlayerNameChanged(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <FormGroup>
                  <Button type="submit" disabled={isButtonDisabled}>Create game</Button>
                </FormGroup>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </div>
    );
  }

}

Home.PropTypes = {
  playerCount: PropTypes.number.isRequired,
  cpuPlayerCount: PropTypes.number.isRequired,
  playerName: PropTypes.string.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired
};

export default Home;
