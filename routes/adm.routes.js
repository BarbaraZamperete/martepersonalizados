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
const s3Client = require("../s3Client");
const { route } = require('express/lib/application');
const { contentDisposition } = require('express/lib/utils');
const fs = require('fs')
require("dotenv").config();

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

// ###### ################ GETS ###################


router.get('/adm/produtos', async (req, res) => {
    const produtoList = await Produtos.findAll();
    const produtos = []
    produtoList.forEach(produto => {
        produtos.push(produto.dataValues)
    })
    res.render('adm/all-produtos', { produtos })
})

router.get('/adm/estampas', async (req, res) => {
    const estampasList = await Estampas.findAll();
    const estampas = []
    estampasList.forEach(estampa => {
        estampas.push(estampa.dataValues)
    })
    res.render('adm/all-estampas', { estampas })
})
router.get('/adm/temas', async (req, res) => {
    const temaList = await Temas.findAll();
    const temas = []
    temaList.forEach(tema => {
        temas.push(tema.dataValues)
    })
    res.render('adm/all-temas', { temas })
})
router.get('/adm/categorias', async (req, res) => {
    const categoriaList = await Categorias.findAll();
    const categorias = []
    categoriaList.forEach(categoria => {
        categorias.push(categoria.dataValues)
    })
    res.render('adm/all-categorias', { categorias })
})

router.get('/adm/login', async (req, res) => {
    res.render('adm/login')
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
    res.render('adm/adm', { categorias, temas })
})

// ###### ################ POST ###################

// ########### ADICONAR PRODUTO

router.post("/adm/add/produto", upload.single('image'), async (req, res) => {
    if (req.body && req.file) {
        const { nome, categoria, preco, descricao } = req.body
        const { filename, path } = req.file
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
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
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
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
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
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
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
        const tema = await Temas.create({
            nome: nome,
            imageUrl: url,
        })
        console.log(tema)
    }
    res.redirect('/adm/add')
});





// ############## EXCLUIR #################

// EXCLUIR CATEGORIA

router.get("/excluir/categoria/:id", async (req, res) => {
    const categoria = await Categorias.findOne({ where: { idCategoria: req.params.id } })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = categoria.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
    } else {
        try {
            fs.unlinkSync("public/uploads/" + categoria.imageUrl)
            console.log("sucesso")
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Categorias.destroy({ where: { idCategoria: req.params.id } });
    res.redirect("/adm/categorias")
})
router.get("/excluir/tema/:id", async (req, res) => {
    const tema = await Temas.findOne({ where: { idTemas: req.params.id } })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = tema.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
    } else {
        try {
            fs.unlinkSync("public/uploads/" + tema.imageUrl)
            console.log("sucesso")
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Temas.destroy({ where: { idTemas: req.params.id } });
    console.log(destruir)
    res.redirect("/adm/temas")
})

router.get("/excluir/produto/:id", async (req, res) => {
    const produto = await Produtos.findOne({ where: { idProduto: req.params.id } })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = produto.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
    } else {
        try {
            fs.unlinkSync("public/uploads/" + produto.imageUrl)
            console.log("sucesso")
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Produtos.destroy({ where: { idProduto: req.params.id } });
    console.log(destruir)
    res.redirect("/adm/produtos")
})
router.get("/excluir/estampa/:id", async (req, res) => {
    const estampa = await Estampas.findOne({ where: { idEstampa: req.params.id } })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = estampa.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
    } else {
        try {
            fs.unlinkSync("public/uploads/" + estampa.imageUrl)
            console.log("sucesso")
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Estampas.destroy({ where: { idEstampa: req.params.id } });
    console.log(destruir)
    res.redirect("/adm/estampas")
})



// ############## EDITAR PRODUTO GET AND PUT #################

router.get("/adm/edit/produto/:id", async (req, res) => {
    const categoriasList = await Categorias.findAll();
    const categorias = []
    categoriasList.forEach(categoria => {
        categorias.push(categoria.dataValues);
    })
    const produtoCru = await Produtos.findOne({ where: { idProduto: req.params.id } })
    console.log(produtoCru + "teste")
    if (produtoCru) {
        const produto = produtoCru.dataValues
        res.render("adm/edit-page", { produto, categorias });
    }else{
        res.render("adm/edit-page", { categorias });
    }

})

router.post("/adm/edit/:id", async (req, res) => {
    // console.log(req.body)
    const id = req.params.id
    const { nome, preco, descricao } = req.body
    const update = await Produtos.update({ nome: nome, preco: preco, descricao: descricao }, { where: { idProduto: id } })
    console.log(update)
    res.redirect("/adm/produtos")

});

module.exports = router