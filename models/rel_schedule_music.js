module.exports = (sequelize, DataTypes) => {
    const Rel_schedule_music = sequelize.define('rel_schedule_music', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      music_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      primary_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      freezeTableName: true,
    });
    return Rel_schedule_music;
  }
  