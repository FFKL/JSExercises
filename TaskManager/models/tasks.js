var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    database: 'todo',
    user: 'mysql',
    password: 'mysql'
});

var Tasks = {
    list: function(callback) {
        pool.query('SELECT * FROM tasks', callback);
    },

    add: function(task, callback) {
        pool.query('INSERT INTO tasks SET ?', {task: task, flag: false}, callback)
    },

    change: function (id, text, callback) {
        //todo sql update
    },

    complete: function (id, flag, callback) {
        //todo sql update
    },

    delete: function (id, callback) {
        //todo sql delete
    }
};

module.exports = Tasks;