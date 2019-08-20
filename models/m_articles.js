module.exports = (sequelize, DataTypes) => {
    const M_articles = sequelize.define('m_articles', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      files_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
    });
    return M_articles;
  }
  