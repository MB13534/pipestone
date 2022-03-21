module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, DOUBLE} = DataTypes;
  const TimeseriesFinalDailyVYeartodatePumped = sequelize.define(
    'timeseries_final_daily_v_yeartodate_pumped',
    {
      location_name: {
        type: TEXT,
        primaryKey: true,
      },
      parameter: {
        type: TEXT,
      },
      units: {
        type: TEXT,
      },
      collect_timestamp: {
        type: DATE,
      },
      measured_value: {
        type: DOUBLE,
      },
      location_ndx: {
        type: INTEGER,
      },
      permitted_max: {
        type: INTEGER,
      },
    },
    {
      defaultScope: {
        order: [['collect_timestamp', 'asc']],
      },
      schema: 'client_pipestone',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesFinalDailyVYeartodatePumped;
};
