module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const CurrentLastFewWidgets = sequelize.define(
    'current_lastfew_widgets_views',
    {
      client: {
        type: TEXT,
      },
      measurement_type_desc: {
        type: TEXT,
      },
      location_name: {
        type: TEXT,
      },
      collect_timestamp: {
        type: DATE,
      },
      measured_value: {
        type: REAL,
      },
      unit_desc: {
        type: TEXT,
      },
      alert: {
        type: TEXT,
      },
      location_ndx: {
        type: INTEGER,
      },
      measurement_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      client_ndx: {
        type: INTEGER,
      },
      measurement_type_ndx: {
        type: INTEGER,
      },
      exclude_auth0_user_id: {
        type: TEXT,
      },
    },
    {
      schema: 'client_pipestone',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return CurrentLastFewWidgets;
};
