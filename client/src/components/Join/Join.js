import React, { Component, PropTypes } from 'react';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class Join extends Component {

  componentDidMount() {
    this.props.onGameIdChanged(this.props.params.id);
  }

  joinGame(e) {
    e.preventDefault();
    this.props.onJoinGame();
  }

  render() {
    const { gameId, playerName, isButtonDisabled } = this.props;

    return (
      <div className="Join">
        <h2>Join a game!</h2>
        <Row className="Home-game-form">
          <Col md={4} sm={6} mdOffset={4} smOffset={3}>
            <form onSubmit={e => this.joinGame(e)}>
              <FormGroup controlId="gameId">
                <ControlLabel>Game ID</ControlLabel>
                <FormControl
                  type="text"
                  value={gameId}
                  onChange={e => this.props.onGameIdChanged(e.target.value)}
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
                  <Button type="submit" disabled={isButtonDisabled}>Join game</Button>
                </FormGroup>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </div>
    );
  }

}

Join.PropTypes = {
  gameId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
  isButtonDisabled: PropTypes.bool.isRequired
};

export default Join;
