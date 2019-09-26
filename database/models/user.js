const uuid = require('uuid/v4')
const { hash } = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    underscored: true,
  });
  User.associate = function(models) {
    // associations can be defined here
    User.beforeCreate(async user => {
      user.id = uuid()
      user.password = await hash(user.password, 10)
    })
  };
  return User;
};