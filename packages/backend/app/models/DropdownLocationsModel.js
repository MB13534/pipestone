const {Op} = require('sequelize');
const {SELECTED_USERS} = require('../../constants');
module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL, GEOMETRY} = DataTypes;
  const DropdownLocations = sequelize.define(
    'dropdown_locations',
    {
      location_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      location_name: {
        type: TEXT,
      },
      location_lon_dd: {
        type: REAL,
      },
      location_lat_dd: {
        type: REAL,
      },
      assoc_client_ndx: {
        type: INTEGER,
      },
      location_geometry: {
        type: GEOMETRY,
      },
    },
    {
      defaultScope: {
        where: {
          assoc_client_ndx: {
            [Op.overlap]: `{${SELECTED_USERS}}`,
          },
        },
      },
      timestamps: false,
      schema: 'web',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return DropdownLocations;
};
