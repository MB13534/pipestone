module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, REAL, BOOLEAN} = DataTypes;
  const ListStyles = sequelize.define(
    'list_styles',
    {
      style_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      style_desc: {
        type: TEXT,
      },
      border_color: {
        type: TEXT,
      },
      border_width: {
        type: REAL,
      },
      background_color: {
        type: TEXT,
      },
      point_radius: {
        type: REAL,
      },
      tension: {
        type: REAL,
      },
      point_hover_radius: {
        type: REAL,
      },
      border_radius: {
        type: TEXT,
      },
      fill: {
        type: BOOLEAN,
      },
    },
    {
      timestamps: false,
      schema: 'up_common',
      freezeTableName: true,
      paranoid: true,
    }
  );

  return ListStyles;
};
