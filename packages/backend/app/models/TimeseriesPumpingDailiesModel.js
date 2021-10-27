module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL, BOOLEAN} = DataTypes;
  const TimeseriesPumpingDailies = sequelize.define(
    'timeseries_pumping_daily',
    {
      location_name: {
        type: TEXT,
        primaryKey: true,
      },
      collect_timestamp: {
        type: DATE,
      },
      pumping_af: {
        type: REAL,
      },
      pumping_gpm: {
        type: REAL,
      },
      meter_reading: {
        type: REAL,
      },
      bad_reading_flag: {
        type: BOOLEAN,
      },
      override_flag: {
        type: BOOLEAN,
      },
      fill_value: {
        type: REAL,
      },
      fill_flag: {
        type: BOOLEAN,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      location_ndx: {
        type: INTEGER,
      },
    },
    {
      schema: 'web',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return TimeseriesPumpingDailies;
};
