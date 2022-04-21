const {
    Router
} = require('express');
const router = Router();

const { exibirCategorias } = require("../controllers/categorias.controller")
const { exibirProdutos } = require("../controllers/produtos.controllers")
const { exibirTemas } = require("../controllers/temas.controller")
const { exibirEstampas } = require("../controllers/estampas.controller")

router.get('/', async (req, res) => {
    res.render('index');
})

// ########### PRODUTOS ROTAS

//Exibir categorias
router.get('/produtos/categoria', exibirCategorias)
// Exibir produtos
router.get('/produtos/:categoria', exibirProdutos)



// ########### ESTAMPAS ROTAS
//Exibir Temas
router.get("/estampas/temas", exibirTemas)
//Exibir Estampas
router.get("/estampas/:tema", exibirEstampas)

module.exports = router