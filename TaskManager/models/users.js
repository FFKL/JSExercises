module.exports = function(pool) {
    return {
        findOne: function(username, callback) {
            pool.query('SELECT * FROM users WHERE ?',
                {username: username},
                function(err, results) {
                    callback(err, results[0])
                }
            )
        },

        findById: function(id, callback) {
            pool.query('SELECT * FROM users WHERE ?',
                {id: id},
                function(err, results) {
                    callback(err, results[0]);
                }
            )
        }
    };
};