require("dotenv").config()

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: "mysql"
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: "mysql"
  },
  production: {
    username: "bcdedbaf60a536",
    password: "56a574df",
    database: "heroku_3d7a3807b9b47ee",
    host: "us-cdbr-east-05.cleardb.net",
    dialect: "mysql"
  }
}