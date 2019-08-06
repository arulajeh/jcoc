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
      singer: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
      }
    },
    {
      freezeTableName: true,
    });
    return Music;
  }
  