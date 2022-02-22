const {Op} = require('sequelize');
const {SELECTED_LOCATIONS} = require('../../constants');
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
      defaultScope: {
        // where: {
        //   location_ndx: {
        //     [Op.in]: SELECTED_LOCATIONS,
        //   },
        // },
      },
      timestamps: false,
      schema: 'up_common',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownMeasurements;
};
