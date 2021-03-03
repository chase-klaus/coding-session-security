const { Sequelize } = require('sequelize');

const { DB_CONNECTION_URI } = process.env;

module.exports = new Sequelize(DB_CONNECTION_URI, { logging: false });
