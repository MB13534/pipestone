module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const DropdownMeasurementsFFS = sequelize.define(
    'dropdown_measurements_ffs',
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
      },
    },
    {
      timestamps: false,
      schema: 'client_telluride',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownMeasurementsFFS;
};
