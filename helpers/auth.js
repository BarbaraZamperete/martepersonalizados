const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    // isAuthenticated vem do passport
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('alert_msg', 'Você precisa estar logado');
    res.redirect('/adm/login');
}

module.exports = helpers;