const {Op} = require('sequelize');
const {SELECTED_CLIENTS} = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const AdminDataLastReports = sequelize.define(
    'admin_data_last_report',
    {
      client: {
        type: TEXT,
      },
      location_name: {
        type: TEXT,
      },
      parameter: {
        type: TEXT,
      },
      last_collected: {
        type: DATE,
      },
      last_value: {
        type: REAL,
      },
      unit_desc: {
        type: TEXT,
      },
      alert_status: {
        type: TEXT,
      },
      por_start: {
        type: DATE,
      },
      por_end: {
        type: DATE,
      },
      min_value: {
        type: REAL,
      },
      max_value: {
        type: REAL,
      },
      recordcount: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
      measurement_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      client_ndx: {
        type: INTEGER,
      },
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

  return AdminDataLastReports;
};
