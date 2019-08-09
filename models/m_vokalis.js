module.exports = (sequelize, DataTypes) => {
    const M_vokalis = sequelize.define('m_vokalis', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      users_id: {
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
    return M_vokalis;
  }
  