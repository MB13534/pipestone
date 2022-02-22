module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const DropdownMeasurementsTemperatures = sequelize.define(
    'dropdown_measurements_temperature',
    {
      measurement_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      measurement_name: {
        type: TEXT,
      },
      location_name: {
        type: TEXT,
      },
      location_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      schema: 'client_telluride',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownMeasurementsTemperatures;
};
