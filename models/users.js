module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nip: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dayof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    no_rek: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kepegawaian_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    probation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    join_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  });
  return Users;
}
