module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const TimeseriesFlowVsStages = sequelize.define(
    'timeseries_flow_vs_stage',
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
      stage_ft: {
        type: REAL,
      },
      rating_curve_applied: {
        type: TEXT,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
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

  return TimeseriesFlowVsStages;
};
