const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {
  timeseries_final_totalpumped_v_gpm: model,
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

router.get('/:location', (req, res, next) => {
  model
    .findAll({
      where: {
        location_ndx: req.params.location,
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
