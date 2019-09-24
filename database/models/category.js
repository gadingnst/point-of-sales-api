const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    underscored: true,
  });
  Category.associate = function(models) {
    // associations can be defined here
    Category.beforeCreate(category => category.id = uuid())
    Category.hasMany(models.Product, { as: 'products' })
  };
  return Category;
};