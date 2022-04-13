const {
    Router
} = require('express');
const router = Router();
const multer = require('multer')
const db = require('../models/db')
const path = require('path');

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

router.get('/adm/produtos', async (req,res) => {
    res.render('all-produtos')
})
router.get('/adm/estampas', async (req,res) => {
    res.render('all-estampas')
})

router.get('/adm/login', async (req,res) => {
    res.render('login')
})

router.get('/adm/add', async (req,res) => {
    res.render('adm')
})

router.post("/post", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file)
        
    }
    res.redirect('/')
});

module.exports = router