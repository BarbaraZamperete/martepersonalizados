const {
    Router
} = require('express');
const router = Router();
const multer = require('multer')
const db = require('../models/db')
const path = require('path');
const Produtos = require("../models/Produtos")
const Estampas = require("../models/Estampas")
const Categorias = require("../models/Categorias");

router.get('/', async (req,res) => {
    res.render('index');
})



router.get('/produtos/categoria', async (req, res) => {
    const categoriaList = await Categorias.findAll();
    const categorias = []
    categoriaList.forEach(categoria => {
        categorias.push(categoria.dataValues);
    })
    res.render('produtos/categorias', {categorias} )
})
router.get('/produtos/:categoria', async (req, res) => {
    const categoria = req.params.categoria
    const produtosList = await Produtos.findAll({where: {categoria: categoria}})
    const produtos = []
    produtosList.forEach(produto => {
        produtos.push(produto.dataValues)
    })
    res.render('produtos/produtos', {categoria, produtos})
})

module.exports = router