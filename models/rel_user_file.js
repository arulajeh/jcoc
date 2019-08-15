module.exports = (sequelize, DataTypes) => {
    const Rel_user_file = sequelize.define('rel_user_file', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
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
    return Rel_user_file;
  }
  