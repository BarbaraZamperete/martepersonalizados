
const { Sequelize } = require("sequelize");
const config = require("../config/config.js");

//desenvolvimento
// const db = new Sequelize(
//     config.development.database,
//     config.development.username,
//     config.development.password,
//     config.development
// );
//produção
const db = new Sequelize(
    config.production.database,
    config.production.username,
    config.production.password,
    config.production
);

try {
    db.authenticate();
    console.log("Conexão com o Banco de Dados estabelecida com sucesso");
} catch (error) {
    console.error("Não conectou sabosta: ", error);
}
module.exports = db;