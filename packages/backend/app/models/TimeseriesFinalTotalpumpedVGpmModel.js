module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, DOUBLE, REAL} = DataTypes;
  const TimeseriesFinalTotalpumpedVGpm = sequelize.define(
    'timeseries_final_totalpumped_v_gpm',
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
      max_pumping_rate: {
        type: REAL,
      },
      hours_pumped: {
        type: REAL,
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

  return TimeseriesFinalTotalpumpedVGpm;
};
