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
const Temas = require("../models/Temas")

router.get('/', async (req,res) => {
    res.render('index');
})

// ########### PRODUTOS ROTAS

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



// ########### ESTAMPAS ROTAS
router.get("/estampas/temas", async (req, res) => {
    const temasList = await Temas.findAll();
    const temas = [];
    temasList.forEach(tema => {
        temas.push(tema.dataValues);
    })
    res.render("estampas/temas", {temas})
})
router.get("/estampas/:tema", async (req, res) => {
    const tema = req.params.tema
    const estampasList = await Estampas.findAll({where: {tema: tema}});
    const estampas = []
    estampasList.forEach(estampa => {
        estampas.push(estampa.dataValues)
    })
    res.render("estampas/estampas", {tema, estampas})
})

module.exports = router