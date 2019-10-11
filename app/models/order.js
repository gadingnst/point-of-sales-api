const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
      checkout_id: DataTypes.UUID,
      product_id: DataTypes.UUID,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Order.associate = function(models) {
    // associations can be defined here
    Order.beforeCreate(order => order.id = uuid())
    Order.belongsTo(models.Checkout, { as: 'Checkout', foreignKey: 'checkout_id' })
    Order.belongsTo(models.Product, { as: 'Product', foreignKey: 'product_id' })
  };
  return Order;
};