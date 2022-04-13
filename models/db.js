
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

let db

if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
    //produção
    db = new Sequelize(process.env.HEROKU_POSTGRESQL_GRAY_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
    );
} else {
    // desenvolvimento
    db = new Sequelize(
        config.development.database,
        config.development.username,
        config.development.password,
        config.development
    );
}


try {
    db.authenticate();
    console.log("Conexão com o Banco de Dados estabelecida com sucesso");
} catch (error) {
    console.error("Não conectou sabosta: ", error);
}
module.exports = db;