const uuid = require('uuid/v4')
const faker = require('faker')
const { hash } = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = []
    
    for (let i = 0; i < 15; i++) {
      data.push({
        id: uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await hash('123456', 10),
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    queryInterface.bulkInsert('users', data, {})
    
    data = []

    for (let i = 0; i < 10; i++) {
      data.push({
        id: uuid(),
        name: faker.commerce.department(),
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    await queryInterface.bulkInsert('categories', data, {})

    data = []
    
    const [result] = await queryInterface.sequelize.query('SELECT id from categories')

    for (let i = 0; i < 50; i++) {
      const rand = Math.floor(Math.random() * result.length)
      data.push({
        id: uuid(),
        name: faker.commerce.productName(),
        description: 'No product desription.',
        price: faker.commerce.price(),
        category: result[rand].id,
        stock: rand,
        created_at: new Date(),
        updated_at: new Date()
      })
    }

    return queryInterface.bulkInsert('products', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    async function rollbackProduct() {
      await queryInterface.bulkDelete('categories', null, {})
      await queryInterface.bulkDelete('products', null, {})
    }
    await Promise.all([
      rollbackProduct(),
      queryInterface.bulkDelete('users', null, {})
    ])
  }
}
