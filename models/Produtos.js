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
        img_fieldname: Sequelize.STRING,
        img_destination: Sequelize.STRING,
        img_filename: Sequelize.STRING,
        img_path: Sequelize.STRING,
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Produto