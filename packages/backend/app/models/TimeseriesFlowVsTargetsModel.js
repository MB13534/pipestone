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
      blue_lake_to_stream_cfs: {
        type: REAL,
      },
      native_flow_cfs: {
        type: REAL,
      },
      native_flow_est_cfs: {
        type: REAL,
      },
      below_target_cfs: {
        type: REAL,
      },
      daily_avg_depth_ft: {
        type: REAL,
      },
      shift_applied_ft: {
        type: REAL,
      },
      measured_flow_cfs: {
        type: REAL,
      },
      rating_curve_applied: {
        type: TEXT,
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
      schema: 'client_telluride',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesFlowVsTargets;
};
