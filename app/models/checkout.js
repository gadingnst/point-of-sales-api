const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Checkout = sequelize.define('Checkout', {
    user_id: DataTypes.UUID,
    receipt: DataTypes.STRING,
    amount: DataTypes.DOUBLE
  }, {
    underscored: true,
  });
  Checkout.associate = function(models) {
    // associations can be defined here
    Checkout.beforeCreate(checkout => checkout.id = uuid())
    Checkout.belongsTo(models.User, { as: 'User', foreignKey: 'user_id' })
    Checkout.hasMany(models.Order)
  };
  return Checkout;
};