const Produtos = require("../models/Produtos")
const Categorias = require("../models/Categorias")
const s3Client = require("../s3Client");
const fs = require('fs')


const produtosCtrl = {}

produtosCtrl.exibirProdutos = async (req, res) => {
    const categoria = req.params.categoria
    const produtosList = await Produtos.findAll({ where: { categoria: categoria } })
    const produtos = []
    produtosList.forEach(produto => {
        produtos.push(produto.dataValues)
    })
    res.render('produtos/produtos', { categoria, produtos })
}

produtosCtrl.exibirProdutosAdm = async (req, res) => {
    const produtoList = await Produtos.findAll();
    const produtos = []
    produtoList.forEach(produto => {
        produtos.push(produto.dataValues)
    })
    res.render('adm/all-produtos', { produtos })
}

produtosCtrl.adicionarProduto = async (req, res) => {
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
            req.flash("success_msg", "Produto adicionado")
        } else {
            console.log("selecione uma categoria para o produto")
            req.flash("alert_msg", "Selecione uma categoria para o produto")
        }

    } else {
        console.log("preencha todos os dados")
        req.flash("alert_msg", "Preencha todos os dados")
    }
    res.redirect('/adm/add')
}

produtosCtrl.excluirProduto = async (req, res) => {
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
    req.flash("success_msg", "Produto removido")
    res.redirect("/adm/produtos")
}

produtosCtrl.editarProdutoPage = async (req, res) => {
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
}

produtosCtrl.editarProdutoAction = async (req, res) => {
    // console.log(req.body)
    const id = req.params.id
    const { nome, preco, descricao } = req.body
    const update = await Produtos.update({ nome: nome, preco: preco, descricao: descricao }, { where: { idProduto: id } })
    console.log(update)
    req.flash("success_msg", "Produto atualizado")
    res.redirect("/adm/produtos")

}



module.exports = produtosCtrl