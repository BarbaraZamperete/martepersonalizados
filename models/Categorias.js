const Sequelize = require("sequelize")
const db = require("../models/db");

const Categoria = db.define(
    "categorias",
    {
        idCategoria: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome: Sequelize.STRING,
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

module.exports = Categoria