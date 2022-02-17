const express = require('express');
const {checkAccessToken} = require('../../core/middleware/auth.js');
const {
  storage_mitigation_02_table_for_dashes: model,
} = require('../../core/models');

const router = express.Router();

// Attach middleware to ensure that user is authenticated & has permissions
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

router.get('/', (req, res, next) => {
  model
    .findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
