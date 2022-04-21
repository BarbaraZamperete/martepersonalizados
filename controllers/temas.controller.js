const Temas = require("../models/Temas")
const s3Client = require("../s3Client");
const fs = require('fs')

const temasCtrl = {}

temasCtrl.exibirTemasAdm = async (req, res) => {
    const temaList = await Temas.findAll();
    const temas = []
    temaList.forEach(tema => {
        temas.push(tema.dataValues)
    })
    res.render('adm/all-temas', {
        temas
    })
}

temasCtrl.exibirTemas = async (req, res) => {
    const temasList = await Temas.findAll();
    const temas = [];
    temasList.forEach(tema => {
        temas.push(tema.dataValues);
    })
    res.render("estampas/temas", {temas})
}

temasCtrl.adicionarTema = async (req, res) => {
    if (req.body && req.file) {
        const {
            nome
        } = req.body
        const {
            filename,
            path
        } = req.file
        let url = filename;
        if (process.env.HEROKU_POSTGRESQL_GRAY_URL) {
            url = await s3Client.uploadFile(filename, path);
        }
        const tema = await Temas.create({
            nome: nome,
            imageUrl: url,
        })
        console.log(tema)
        req.flash("success_msg", "Tema adicionado")
    }
    res.redirect('/adm/add')
}

temasCtrl.excluirTema = async (req, res) => {
    const tema = await Temas.findOne({
        where: {
            idTemas: req.params.id
        }
    })
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
    const destruir = await Temas.destroy({
        where: {
            idTemas: req.params.id
        }
    });
    console.log(destruir)
    req.flash("success_msg", "Tema removido")
    res.redirect("/adm/temas")
}




module.exports = temasCtrl