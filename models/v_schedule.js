module.exports = (sequelize, DataTypes) => {
    const V_schedule = sequelize.define('v_schedule', {
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
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gitaris: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      basis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pianis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      drummer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
    });
    return V_schedule;
  }
  