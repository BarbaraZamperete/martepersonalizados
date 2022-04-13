const {
    Router
} = require('express');
const router = Router();
const multer = require('multer')
const db = require('../models/db')
const path = require('path');
const Produtos = require("../models/Produtos")
const Estampas = require("../models/Estampas")

router.get('/', async (req,res) => {
    res.render('index');
})



router.get('/produtos', async (req, res) => {
    const listProdutos = await Produtos.findAll();
    const listCategoria = []
    listProdutos.forEach(produto => {
        
        if(!listCategoria.includes(produto.dataValues.categoria)){
            listCategoria.push(produto.dataValues.categoria)
        }
    })
    console.log(listCategoria)
    res.render('produtos', )
})

module.exports = router