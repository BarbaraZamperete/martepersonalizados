const Sequelize = require("sequelize")
const db = require("../models/db");

const Estampa = db.define(
    "estampas",
    {
        idEstampa: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        tema: Sequelize.STRING,
        descricao: Sequelize.STRING,
        // image: Sequelize.STRING
        imageUrl: Sequelize.STRING,
        
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = Estampa