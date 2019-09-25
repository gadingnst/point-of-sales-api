const uuid = require('uuid/v4')
const { hash } = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define('Auth', {
    email: {
      type: DataTypes.STRING,
      args: true,
      msg: 'Email already taken!',
    },
    password: DataTypes.STRING
  }, {
    underscored: true,
  });
  Auth.associate = function(models) {
    // associations can be defined here
    Auth.beforeCreate(async auth => {
      auth.id = uuid()
      auth.password = await hash(auth.password, 10)
    })
  };
  return Auth;
};