module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT} = DataTypes;
  const DropdownFfsCalcTypes = sequelize.define(
    'dropdown_ffs_calc_types',
    {
      ffs_calc_type_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      ffs_calc_type_desc: {
        type: TEXT,
      },
      notes: {
        type: TEXT,
      },
    },
    {
      schema: 'web',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return DropdownFfsCalcTypes;
};
