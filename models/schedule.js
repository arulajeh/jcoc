module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('schedule', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      // vokalis: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // song_leader: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      gitaris: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      basis: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pianis: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      drummer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
      // lagu: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // }
    },
    {
      freezeTableName: true,
    });
    return Schedule;
  }
  