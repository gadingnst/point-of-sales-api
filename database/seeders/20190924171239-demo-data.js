const uuid = require('uuid/v4')
const faker = require('faker')
const { hash } = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      let data = []
      
      for (let i = 0; i < 10; i++) {
        data.push({
          id: uuid(),
          name: faker.name.findName(),
          email: faker.internet.email().toLowerCase(),
          password: await hash('123456', 10),
          created_at: new Date(),
          updated_at: new Date()
        })
      }

      queryInterface.bulkInsert('users', [
        ...data,
        {
          id: uuid(),
          name: 'Sutan Gading',
          email: 'sutan.gnst@gmail.com',
          password: await hash('gading', 10),
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {})
      
      data = [
        {
          id: uuid(),
          name: 'Programming Books',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]

      await queryInterface.bulkInsert('categories', data, {})
      const [result] = await queryInterface.sequelize.query('SELECT id from categories')
      const rand = Math.floor(Math.random() * result.length)

      data = [
        {
          id: uuid(),
          name: 'Mastering React JS',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'JavaScript ES6 Beyond',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Laravel 6.0',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Java',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering JavaScript with Google Map API',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering PHP',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Codeigniter',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Angular JS',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Python in Artificial Intellegence',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Machine Learning with Python',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Microcontroller with Arduino',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Mobile Apps Development with React Native',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Progressive Web App',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Mastering Node JS with Express JS',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'SQL Databases for Beginner',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'MongoDB Advanced',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'Web Application with PHP',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: uuid(),
          name: 'C++ for Advanced',
          description: 'No book desription.',
          price: faker.random.number({ min: 50000, max: 250000, precision: 1000 }),
          category: result[rand].id,
          stock: faker.random.number({ min: 0, max: 100, precision: 9 }),
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      return queryInterface.bulkInsert('products', data, {})
    } catch (err) {
      console.log(err)
    }
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
