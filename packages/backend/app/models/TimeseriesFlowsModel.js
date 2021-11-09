module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL, BOOLEAN} = DataTypes;
  const TimeseriesFlows = sequelize.define(
    'timeseries_flow',
    {
      location_name: {
        type: TEXT,
        primaryKey: true,
      },
      collect_timestamp: {
        type: DATE,
      },
      flow_cfs: {
        type: REAL,
      },
      calculated: {
        type: BOOLEAN,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
      exclude_auth0_user_id: {
        type: TEXT,
      },
    },
    {
      defaultScope: {
        order: [['collect_timestamp', 'asc']],
      },
      schema: 'web',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesFlows;
};
