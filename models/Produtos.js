const Sequelize = require("sequelize")
const db = require("../models/db");

const Produto = db.define(
    "produtos",
    {
        idProduto: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        categoria: Sequelize.STRING,
        nome: Sequelize.STRING,
        descricao: Sequelize.STRING,
        preco: Sequelize.STRING,
        // image: Sequelize.STRING
        imageUrl: Sequelize.STRING,
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Produto