const Estampas = require("../models/Estampas")
const s3Client = require("../s3Client");
const fs = require('fs')

const estampasCtrl = {}

estampasCtrl.exibirEstampasAdm = async (req, res) => {
    const estampasList = await Estampas.findAll();
    const estampas = []
    estampasList.forEach(estampa => {
        estampas.push(estampa.dataValues)
    })
    res.render('adm/all-estampas', {
        estampas
    })
}

estampasCtrl.exibirEstampas =  async (req, res) => {
    const tema = req.params.tema
    const estampasList = await Estampas.findAll({where: {tema: tema}});
    const estampas = []
    estampasList.forEach(estampa => {
        estampas.push(estampa.dataValues)
    })
    res.render("estampas/estampas", {tema, estampas})
}

estampasCtrl.adicionarEstampa = async (req, res) => {
    if (req.body && req.file) {
        const {
            tema,
            descricao
        } = req.body
        const {
            filename,
            path
        } = req.file
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
            req.flash("success_msg", "Estampa adicionada")
        } else {
            req.flash("alert_msg", "Escolha um Tema")
        }
    } else {
        req.flash("alert_msg", "Preencha todos os dados")
    }
    res.redirect('/adm/add')
}


estampasCtrl.excluirEstampa =  async (req, res) => {
    const estampa = await Estampas.findOne({
        where: {
            idEstampa: req.params.id
        }
    })
    if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
        const fileName = estampa.imageUrl.substr(45)
        const url = await s3Client.deletFile(fileName)
    } else {
        try {
            fs.unlinkSync("public/uploads/" + estampa.imageUrl)
        } catch (err) {
            console.log(err + " erro ")
        }
    }
    const destruir = await Estampas.destroy({
        where: {
            idEstampa: req.params.id
        }
    });
    req.flash("success_msg", "Estampa removida")
    res.redirect("/adm/estampas")
}


module.exports = estampasCtrl