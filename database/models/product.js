const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    category_id: DataTypes.UUID,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Product.associate = function(models) {
    // associations can be defined here
    Product.beforeCreate(product => product.id = uuid())
    Product.belongsTo(models.Category, { as: 'category', foreignKey: 'category_id' })
  };
  return Product;
};