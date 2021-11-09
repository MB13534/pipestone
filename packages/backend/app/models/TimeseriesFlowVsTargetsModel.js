module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const TimeseriesFlowVsTargets = sequelize.define(
    'timeseries_flow_vs_targets',
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
      ft_rate_cfs: {
        type: REAL,
      },
      ft_remark: {
        type: TEXT,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
      client_ndx: {
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

  return TimeseriesFlowVsTargets;
};
