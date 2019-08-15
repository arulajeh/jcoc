module.exports = (sequelize, DataTypes) => {
    const M_vokalis = sequelize.define('m_vokalis', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
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
    return M_vokalis;
  }
  