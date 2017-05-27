const express = require('express');
const _ = require('lodash');
const statisticsService = require('../services/statisticsService');
const { StatProperties } = require('../../client/src/shared/constants');

const router = express.Router();

router.get('/', (req, res) => {
  const query = req.query.properties || '';
  const properties = _.intersection(query.split(','), StatProperties);
  Promise.all(properties.map(prop => statisticsService.listByProperty(prop))).then((results) => {
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

module.exports = router;
