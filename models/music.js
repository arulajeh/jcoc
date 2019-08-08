module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define('music', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      judul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      penyanyi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lirik: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      chord: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
    });
    return Music;
  }
  