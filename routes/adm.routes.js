const {
    Router
} = require('express');
const router = Router();
const multer = require('multer')
const db = require('../models/db')
const path = require('path');
const Produtos = require("../models/Produtos")
const Estampas = require("../models/Estampas")
const Categorias = require("../models/Categorias")
const Temas = require("../models/Temas")
const s3Client = require("../s3Client")

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

router.get('/adm/produtos', async (req, res) => {
    const produtoList = await Produtos.findAll();
    const produtos = []
    produtoList.forEach(produto => {
        produtos.push(produto.dataValues)
    })
    res.render('all-produtos', { produtos })
})

router.get('/adm/estampas', async (req, res) => {
    const estampasList = await Estampas.findAll();
    const estampas = []
    estampasList.forEach(estampa => {
        estampas.push(estampa.dataValues)
    })
    res.render('all-estampas', {estampas})
})
router.get('/adm/temas', async (req, res) => {
    const temaList = await Temas.findAll();
    const temas = []
    temaList.forEach(tema => {
        temas.push(tema.dataValues)
    })
    res.render('all-temas', {temas})
})
router.get('/adm/categorias', async (req, res) => {
    const categoriaList = await Categorias.findAll();
    const categorias = []
    categoriaList.forEach(categoria => {
        categorias.push(categoria.dataValues)
    })
    res.render('all-categorias', {categorias})
})

router.get('/adm/login', async (req, res) => {
    res.render('login')
})

router.get('/adm/add', async (req, res) => {
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
    res.render('adm', { categorias, temas })
})

// ########### ADICONAR PRODUTO

router.post("/adm/add/produto", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { nome, categoria, preco, descricao } = req.body
        const { filename, path } = req.file
        const url = await s3Client.uploadFile(filename, path);
        if (categoria != "null") {
            const produto = await Produtos.create({
                nome: nome,
                categoria: categoria,
                preco: preco,
                descricao: descricao,
                imageUrl: url,
            });
            // console.log(produto)
        } else {
            console.log("selecione uma categoria para o produto")
        }

    } else {
        console.log("preencha todos os dados")
    }

    res.redirect('/adm/add')
});

// ########### ADICONAR ESTAMPA

router.post("/adm/add/estampa", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { tema, descricao } = req.body
        const { filename, path } = req.file
        const url = await s3Client.uploadFile(filename, path);
        if (tema != "") {
            const estampa = await Estampas.create({
                tema: tema,
                descricao: descricao,
                imageUrl: url,
            });
            // console.log(estampa)
        } else {
            console.log("insira um tema")
        }
    } else {
        console.log("preencha todos os dados")
    }
    res.redirect('/adm/add')
});

// ########### ADICONAR CATEGORIA

router.post("/adm/add/categoria", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { nome } = req.body
        const { filename, fieldname, path, destination } = req.file
        const url = await s3Client.uploadFile(filename, path);
        const categoria = await Categorias.create({
            nome: nome,
            imageUrl: url,
        })
        // console.log(categoria)
    }
    res.redirect('/adm/add')
});

// ########### ADICONAR TEMA

router.post("/adm/add/tema", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { nome } = req.body
        const { filename, path } = req.file
        const url = await s3Client.uploadFile(filename, path);
        const tema = await Temas.create({
            nome: nome,
            imageUrl: url,
        })
        console.log(tema)
    }
    res.redirect('/adm/add')
});


module.exports = router