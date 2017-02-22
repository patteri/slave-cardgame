const chai = require('chai');
const _ = require('lodash');
const Player = require('../../models/player');

const expect = chai.expect;

describe('Player', () => {
  it('Invalid type', () => {
    expect(() => new Player("invalid", "name")).to.throw('Invalid player type');
  });

  it('Valid player', () => {
    const name = "name";
    let player = new Player(Player.PlayerTypes.HUMAN, name);
    expect(player.name).to.equal(name);
    expect(player.type).to.equal(Player.PlayerTypes.HUMAN);
  });
});