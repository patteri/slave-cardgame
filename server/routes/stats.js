const express = require('express');
const _ = require('lodash');
const statisticsService = require('../services/statisticsService');
const { StatProperties } = require('../../client/src/shared/constants');

const router = express.Router();

router.get('/', (req, res) => {
  const query = req.query.properties || '';
  let limit = Number.parseInt(req.query.limit, 10);
  limit = Number.isInteger(limit) ? limit : undefined;
  const properties = _.intersection(query.split(','), StatProperties);

  Promise.all(properties.map(prop => statisticsService.listByProperty(prop, limit))).then((results) => {
    const result = {};
    results.forEach((prop, index) => {
      const property = properties[index];
      result[property] = prop.map(item => ({
        name: item.username,
        value: item[property]
      }));
    });
    res.json(result);
  });
});

router.get('/:username', (req, res) => {
  const username = req.params.username || '';
  statisticsService.getByUsername(username).then((result) => {
    if (result) {
      res.json(_.pick(result, [
        'username',
        'totalGames',
        'averageGamePoints',
        'totalGameWins',
        'totalGameLooses',
        'totalTournaments',
        'averageTournamentPoints',
        'totalInterrupts',
        'currentWinningStreak',
        'longestWinningStreak',
        'currentLooseStreak',
        'longestLooseStreak'
      ]));
    }
    else {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

module.exports = router;
