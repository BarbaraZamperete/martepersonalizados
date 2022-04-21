const {
    Router
} = require('express');
const router = Router();
const Categorias = require("../models/Categorias")
const Temas = require("../models/Temas")

require("dotenv").config();
const passport = require('passport');
const {
    isAuthenticated
} = require('../helpers/auth');
const upload = require("../config/multer")
const {
    adicionarProduto,
    exibirProdutosAdm,
    excluirProduto,
    editarProdutoAction,
    editarProdutoPage
} = require("../controllers/produtos.controllers")
const {
    exibirEstampasAdm,
    adicionarEstampa,
    excluirEstampa
} = require("../controllers/estampas.controller")
const {
    exibirTemasAdm,
    adicionarTema,
    excluirTema
} = require("../controllers/temas.controller")
const {
    exibirCategoriasAdm,
    adicionarCategoria,
    excluirCategoria
} = require("../controllers/categorias.controller")

router.get("/adm", (req, res) => {
    res.redirect("/adm/add")
})



// ###### ################ GETS ###################

router.get('/adm/produtos', isAuthenticated, exibirProdutosAdm)

//Exibir Estampas Adm
router.get('/adm/estampas', isAuthenticated, exibirEstampasAdm)

//Exibir Temas Adm
router.get('/adm/temas', isAuthenticated, exibirTemasAdm)
//Exibir Categorias Adm
router.get('/adm/categorias', isAuthenticated, exibirCategoriasAdm)


// Adicionar Page
router.get('/adm/add', isAuthenticated, async (req, res) => {
    const categoriasList = await Categorias.findAll();
    const categorias = []
    categoriasList.forEach(categoria => {
        categorias.push(categoria.dataValues);
    })
    const temaList = await Temas.findAll();
    const temas = []
    temaList.forEach(tema => {
        temas.push(tema.dataValues);
    })
    res.render('adm/adm', {
        categorias,
        temas
    })
})

// ###### ################ POST ###################

// ########### ADICONAR PRODUTO

router.post("/adm/add/produto", isAuthenticated, upload.single('image'), adicionarProduto);

// ########### ADICONAR ESTAMPA

router.post("/adm/add/estampa", isAuthenticated, upload.single('image'), adicionarEstampa);

// ########### ADICONAR CATEGORIA

router.post("/adm/add/categoria", isAuthenticated, upload.single('image'), adicionarCategoria);

// ########### ADICONAR TEMA

router.post("/adm/add/tema", isAuthenticated, upload.single('image'), adicionarTema);





// ############## EXCLUIR #################

// EXCLUIR CATEGORIA

router.get("/excluir/categoria/:id", isAuthenticated, excluirCategoria)

// EXCLUIR TEMA
router.get("/excluir/tema/:id", isAuthenticated, excluirTema)

// EXCLUIR PRODUTO
router.get("/excluir/produto/:id", isAuthenticated, excluirProduto)

// EXCLUIR ESTAMPA
router.get("/excluir/estampa/:id", isAuthenticated, excluirEstampa)



// ############## EDITAR PRODUTO GET AND PUT #################

router.get("/adm/edit/produto/:id", isAuthenticated, editarProdutoPage)

router.post("/adm/edit/:id", isAuthenticated, editarProdutoAction);


/* ################## LOGIN  ######################### */
router.get('/adm/login', async (req, res) => {
    res.render('adm/login')
})
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/adm/login',
    successRedirect: '/adm/add',
    failureFlash: true
}))

router.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.flash("success_msg", "Você foi deslogado")
    res.redirect("/adm/login")
})

module.exports = router