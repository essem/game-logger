module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
  });

  user.associate = (models) => {
    user.hasMany(models.player);
  };

  return user;
};
