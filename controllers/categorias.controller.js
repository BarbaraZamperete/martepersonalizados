const Categorias = require("../models/Categorias")
const s3Client = require("../s3Client");
const fs = require('fs')

const categoriasCtrl = {}

categoriasCtrl.exibirCategoriasAdm = async (req, res) => {
    const categoriaList = await Categorias.findAll();
    const categorias = []
    categoriaList.forEach(categoria => {
        categorias.push(categoria.dataValues)
    })
    res.render('adm/all-categorias', {
        categorias
    })
}

categoriasCtrl.exibirCategorias = async (req, res) => {
    const categoriaList = await Categorias.findAll();
    const categorias = []
    categoriaList.forEach(categoria => {
        categorias.push(categoria.dataValues);
    })
    res.render('produtos/categorias', {categorias} )
}

categoriasCtrl.adicionarCategoria = async (req, res) => {
    if (req.body && req.file) {
        const {
            nome
        } = req.body
        const {
            filename,
            fieldname,
            path,
            destination
        } = req.file
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
        const categoria = await Categorias.create({
            nome: nome,
            imageUrl: url,
        })
        req.flash("success_msg", "Categoria adicionada")
    }
    res.redirect('/adm/add')
}

categoriasCtrl.excluirCategoria =  async (req, res) => {
    const categoria = await Categorias.findOne({
        where: {
            idCategoria: req.params.id
        }
    })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = categoria.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
        req.flash("success_msg", "Categoria removida")
    } else {
        try {
            fs.unlinkSync("public/uploads/" + categoria.imageUrl)
            console.log("sucesso")
            req.flash("success_msg", "Categoria removida")
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Categorias.destroy({
        where: {
            idCategoria: req.params.id
        }
    });
    res.redirect("/adm/categorias")
}

module.exports = categoriasCtrl