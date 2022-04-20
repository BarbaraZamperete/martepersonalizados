const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    // isAuthenticated vem do passport
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/adm/login');
}

module.exports = helpers;