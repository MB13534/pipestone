module.exports = (sequelize, DataTypes) => {
  const {INTEGER, TEXT, UUID, DATE, REAL} = DataTypes;
  const RatingCurves = sequelize.define(
    'rating_curves',
    {
      id: {
        type: UUID,
        primaryKey: true,
      },
      parent_id: {
        type: UUID,
      },
      former_parent_id: {
        type: UUID,
      },
      status_id: {
        type: INTEGER,
      },
      created_by: {
        type: UUID,
      },
      updated_by: {
        type: UUID,
      },
      deleted_by: {
        type: UUID,
      },
      ffs_ndx: {
        type: INTEGER,
      },
      ffs_desc: {
        type: TEXT,
      },
      measurement_ndx: {
        type: INTEGER,
      },
      ffs_effective_ts: {
        type: DATE,
      },
      ffs_low_stage: {
        type: REAL,
      },
      ffs_high_stage: {
        type: REAL,
      },
      ffs_calc_type_ndx: {
        type: INTEGER,
      },
      ffs_a: {
        type: REAL,
      },
      ffs_b: {
        type: REAL,
      },
      ffs_c: {
        type: REAL,
      },
      ffs_shift: {
        type: REAL,
      },
      notes: {
        type: TEXT,
      },
    },
    {
      defaultScope: {
        order: [['created_at', 'asc']],
      },
      schema: 'calcs',
      paranoid: true,
      tableName: 'flow_from_stage',
    }
  );

  RatingCurves.associate = function (models) {
    RatingCurves.belongsTo(models.content_node_statuses, {
      foreignKey: 'status_id',
      as: 'content_node_statuses',
    });
    RatingCurves.hasMany(models.rating_curves, {
      foreignKey: 'parent_id',
      as: 'versions',
    });
    RatingCurves.belongsTo(models.rating_curves, {
      foreignKey: 'parent_id',
      as: 'parent',
    });
  };

  return RatingCurves;
};
