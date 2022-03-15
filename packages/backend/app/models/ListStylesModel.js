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
      outline_opacity: {
        type: REAL,
      },
      outline_radius: {
        type: INTEGER,
      },
      outline_border_width: {
        type: INTEGER,
      },
      outline_color: {
        type: TEXT,
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
