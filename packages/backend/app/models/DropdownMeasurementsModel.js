module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const DropdownMeasurements = sequelize.define(
    'dropdown_measurements',
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
      schema: 'web',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownMeasurements;
};
