const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {timeseries_final_elevation_v_gpm: model} = require('../../core/models');

const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

// router.get('/', (req, res, next) => {
//   model
//     .findAll()
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.get('/:parameters/:locations', (req, res, next) => {
  const options = ['Air Temperature', 'Water Temperature'].includes(
    req.params.parameters
  )
    ? [44]
    : [];
  model
    .findAll({
      where: {
        parameter: {[Op.in]: [req.params.parameters, 'Depth to Groundwater']},
        location_ndx: {
          [Op.in]: [...req.params.locations.split(','), ...options],
        },
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
