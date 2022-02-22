module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, DATE, REAL} = DataTypes;
  const CurrentConditionsWidgets = sequelize.define(
    'current_conditions_widgets',
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
      last_collected: {
        type: DATE,
      },
      last_value: {
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
      schema: 'client_telluride',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return CurrentConditionsWidgets;
};
