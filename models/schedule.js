module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('schedule', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      gitaris: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      basis: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pianis: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      drummer: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      primary_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      freezeTableName: true,
    });
    return Schedule;
  }
  