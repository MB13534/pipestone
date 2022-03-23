module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, DOUBLE} = DataTypes;
  const TimeseriesFinalElevationHourly = sequelize.define(
    'timeseries_final_elevation_hourly',
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

  return TimeseriesFinalElevationHourly;
};
