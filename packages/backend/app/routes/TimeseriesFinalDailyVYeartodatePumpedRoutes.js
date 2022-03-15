const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {
  timeseries_final_daily_v_yeartodate_pumped: model,
} = require('../../core/models');

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

router.get('/:locations', (req, res, next) => {
  model
    .findAll({
      where: {
        [Op.or]: [
          {location_ndx: [...req.params.locations.split(',')]},
          {parameter: 'Year to Date Pumped All Wells'},
        ],
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
