module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('content', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      files_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
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
    return Content;
  }
  