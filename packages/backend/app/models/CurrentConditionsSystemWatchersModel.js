const {Op} = require('sequelize');
const {SELECTED_CLIENTS} = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE} = DataTypes;
  const CurrentConditionsSystemWatchers = sequelize.define(
    'current_conditions_system_watcher',
    {
      client: {
        type: TEXT,
      },
      location_name: {
        type: TEXT,
      },
      last_collected: {
        type: DATE,
      },
      alert_status: {
        type: TEXT,
      },
      location_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      client_ndx: {
        type: INTEGER,
      },
      // exclude_auth0_user_id: {
      //   type: TEXT,
      // },
    },
    {
      defaultScope: {
        where: {
          client_ndx: {
            [Op.in]: SELECTED_CLIENTS,
          },
        },
      },
      schema: 'web',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return CurrentConditionsSystemWatchers;
};
