module.exports = (sequelize, DataTypes) => {
  const {TEXT, REAL} = DataTypes;
  const DischargeMonitoringReports = sequelize.define(
    'telluride_01_temperature_monthly_report',
    {
      dmr_location: {
        type: TEXT,
        primaryKey: true,
      },
      dmr_year: {
        type: REAL,
      },
      month_abbrev: {
        type: TEXT,
      },
      daily_maximum: {
        type: REAL,
      },
      max_weekly_average: {
        type: REAL,
      },
      remark: {
        type: TEXT,
      },
    },
    {
      schema: 'client_telluride',
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return DischargeMonitoringReports;
};
