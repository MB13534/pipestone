const {Op} = require('sequelize');
const {SELECTED_LOCATIONS} = require('../../constants');
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
      defaultScope: {
        // where: {
        //   location_ndx: {
        //     [Op.in]: SELECTED_LOCATIONS,
        //   },
        // },
      },
      timestamps: false,
      schema: 'web',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownMeasurementsFFS;
};
