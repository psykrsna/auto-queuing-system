var Sequelize = require("sequelize");
var DB_PARAMS = {
  "logging" : false,
  "host" : process.env.DB_HOST,
  "dialect": "mysql",
  "multipleStatements": true,
  "dialectOptions": {
      "multipleStatements": true
  },
  "pool": {
      "max": 5,
      "min": 0,
      "idle": 10000
  },
  "operatorsAliases": false
}

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, DB_PARAMS);
module.exports = db;