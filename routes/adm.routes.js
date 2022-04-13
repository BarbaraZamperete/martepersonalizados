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

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

// router.get('/adm/produtos', async (req, res) => {
//     res.render('all-produtos')
// })
// router.get('/adm/estampas', async (req, res) => {
//     res.render('all-estampas')
// })

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
    res.render('adm', {categorias, temas})
})

// ########### ADICONAR PRODUTO

router.post("/adm/add/produto", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { nome, categoria, preco, descricao } = req.body
        const { destination, filename, fieldname, path } = req.file
        if (categoria != "null") {
            const produto = await Produtos.create({
                nome: nome,
                categoria: categoria,
                preco: preco,
                descricao: descricao,
                img_fieldname: fieldname,
                img_destination: destination,
                img_filename: filename,
                img_path: path,
            });
            // console.log(produto)
        }else{
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
        const { destination, filename, fieldname, path } = req.file
        if (tema != "") {
            const estampa = await Estampas.create({
                tema: tema,
                descricao: descricao,
                img_fieldname: fieldname,
                img_destination: destination,
                img_filename: filename,
                img_path: path,
            });
            // console.log(estampa)
        }else{
            console.log("insira um tema")
        }
    } else {
        console.log("preencha todos os dados")
    }
    res.redirect('/adm/add')
});

// ########### ADICONAR CATEGORIA

router.post("/adm/add/categoria", upload.single('image'), async (req, res) => {
    if (req.file && req.body) {
        const { nome } = req.body
        const { destination, filename, fieldname, path } = req.file
        const categoria = await Categorias.create({
            nome: nome, 
            img_fieldname: fieldname,
            img_destination: destination,
            img_filename: filename,
            img_path: path,
        })
        console.log(categoria)
    }
    res.redirect('/adm/add')
});

// ########### ADICONAR TEMA

router.post("/adm/add/tema", upload.single('image'), async (req, res) => {
    if (req.file && req.body) {
        const { nome } = req.body
        const { destination, filename, fieldname, path } = req.file
        const tema = await Temas.create({
            nome: nome, 
            img_fieldname: fieldname,
            img_destination: destination,
            img_filename: filename,
            img_path: path,
        })
        console.log(tema)
    }
    res.redirect('/adm/add')
});


module.exports = router