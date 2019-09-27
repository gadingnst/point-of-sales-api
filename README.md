# Point of Sales API

> RESTful API for Point of Sales App

## TODO Task
- [x] CRUD Products
- [x] CRUD Categories
- [x] Validation schema
- [x] Search product by name
- [x] Sort product by name, category, date updated
- [x] Pagination products
- [x] Upload image (on products)
- [x] Cannot reduce stock (on products) below 0
- [x] Allowed CORS
- [x] Authentication with JWT
- [x] Rows caching with redis

## Stacks
- Node JS
- MySQL
- ExpressJS
- Sequelize ORM
- JOI Validator
- Redis

## Build Setup
1. Clone repository
`$ git clone https://github.com/sutanlab/point-of-sales-api.git`

2. Install depedencies
```bash
# with npm
$ npm install

# or with yarn
$ yarn install
```

3. Setup your environment variable in `.env` files (if not exists, create your own).
```env
# NODE_ENV development | production | test
NODE_ENV = development

# DATABASE
DB_HOSTNAME = 127.0.0.1
DB_USERNAME = root
DB_PASSWORD = xxxx
DB_NAME = dbtest

# SECRET KEY
SECRET_JWT = xxxx
```

4. Run database migrations (with shortcut scripts with `yarn` or `npm run`)
```bash
$ yarn db:init # create database

$ yarn db:migrate # run database migrations

$ yarn db:seed # run database seeder (if you want)

$ yarn db:rollback # rollback migrations

$ yarn db:drop # drop table
```

5. Serve server
```bash
$ yarn start
```

---
Copyright © 2019 by Sutan Gading Fadhillah Nasution