module.exports = (sequelize, DataTypes) => {
    const Master_lagu = sequelize.define('master_lagu', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      music_name: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
    });
    return Master_lagu;
  }
  