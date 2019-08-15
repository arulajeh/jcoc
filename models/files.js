module.exports = (sequelize, DataTypes) => {
    const Files = sequelize.define('m_files', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      file: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      uploadBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_size: {
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
    return Files;
  }
  