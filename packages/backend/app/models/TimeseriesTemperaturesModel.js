module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const TimeseriesTemperatures = sequelize.define(
    'timeseries_temperature',
    {
      location_name: {
        type: TEXT,
        primaryKey: true,
      },
      collect_timestamp: {
        type: DATE,
      },
      measured_temp_degf: {
        type: REAL,
      },
      temp_rolling_two_hour_avg_degf: {
        type: REAL,
      },
      temp_daily_avg_degf: {
        type: REAL,
      },
      temp_rolling_seven_day_avg_degf: {
        type: REAL,
      },
      measured_temp_degc: {
        type: REAL,
      },
      temp_rolling_two_hour_avg_degc: {
        type: REAL,
      },
      temp_daily_avg_degc: {
        type: REAL,
      },
      temp_rolling_seven_day_avg_degc: {
        type: REAL,
      },
      collect_gap: {
        type: DATE,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
    },
    {
      schema: 'client_telluride',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesTemperatures;
};
