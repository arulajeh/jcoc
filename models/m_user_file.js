module.exports = (sequelize, DataTypes) => {
    const M_user_file = sequelize.define('rel_user_file', {
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
      }
    },
    {
      freezeTableName: true,
    });
    return M_user_file;
  }
  