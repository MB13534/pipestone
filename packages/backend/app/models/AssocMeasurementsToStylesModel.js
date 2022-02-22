module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL} = DataTypes;
  const AssocMeasurementsToStyles = sequelize.define(
    'assoc_measurements_to_styles',
    {
      measurement_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      measurement_type_ndx: {
        type: TEXT,
      },
      style_ndx: {
        type: TEXT,
      },
      notes: {
        type: REAL,
      },
    },
    {
      timestamps: false,
      schema: 'up_common',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return AssocMeasurementsToStyles;
};
