module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, DOUBLE, ARRAY} = DataTypes;
  const TimeseriesDtwVPrecipOrBaroOrPumps = sequelize.define(
    'timeseries_dtw_v_precip_or_baro_or_pumps',
    {
      location_name: {
        type: TEXT,
        primaryKey: true,
      },
      parameter: {
        type: TEXT,
      },
      collect_timestamp: {
        type: DATE,
      },
      measured_value: {
        type: DOUBLE,
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
        type: ARRAY(TEXT),
      },
      measurement_type_ndx: {
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

  return TimeseriesDtwVPrecipOrBaroOrPumps;
};
