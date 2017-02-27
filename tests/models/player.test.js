const chai = require('chai');
const HumanPlayer = require('../../models/humanPlayer');
const CpuPlayer = require('../../models/cpuPlayer');

const expect = chai.expect;

describe('Player', () => {
  it('Valid human player', () => {
    const name = 'human';
    let player = new HumanPlayer(name);
    expect(player.name).to.equal(name);
  });

  it('Valid cpu player', () => {
    const name = 'cpu';
    let player = new CpuPlayer(name);
    expect(player.name).to.equal(name);
  });
});
