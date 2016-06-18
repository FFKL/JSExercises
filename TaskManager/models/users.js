module.exports = function(pool) {
    var Users = {
        get: function(username, callback) {
            pool.query('SELECT * FROM users WHERE ?', {username: username}, callback)
        }
    };
    return Users;
};