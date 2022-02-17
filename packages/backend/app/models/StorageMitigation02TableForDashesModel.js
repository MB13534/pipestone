module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, FLOAT} = DataTypes;
  const StorageMitigation02TableForDashes = sequelize.define(
    'storage_mitigation_02_table_for_dashes',
    {
      d_year: {
        type: FLOAT,
      },
      d_month: {
        type: FLOAT,
      },
      month_abbrev: {
        type: TEXT,
      },
      month_name: {
        type: TEXT,
      },
      measurement_desc: {
        type: TEXT,
        primaryKey: true,
      },
      monthly_af: {
        type: FLOAT,
      },
      cumulative_af: {
        type: FLOAT,
      },
      accounting_year: {
        type: FLOAT,
      },
      display_order: {
        type: INTEGER,
      },
    },
    {
      defaultScope: {
        order: [['display_order', 'asc']],
      },
      schema: 'client_telluride',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return StorageMitigation02TableForDashes;
};
