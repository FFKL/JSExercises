module.exports = {
    login: function(req, res) {
        if (req.user !== undefined) {
            res.render('layout', {
                user: req.user
            });
        } else {
            res.render('layout');
        }
    },
    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};