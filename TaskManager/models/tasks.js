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

    change: function (id, task, callback) {
        pool.query('UPDATE tasks SET ? WHERE ?', [{task: task}, {id: id}], callback)
    },

    complete: function (id, callback) {
        pool.query('UPDATE tasks SET ? WHERE ?', [{flag: true}, {id: id}], callback)
    },

    delete: function (id, callback) {
        pool.query('DELETE FROM tasks WHERE ?', {id: id}, callback)
    }
};

module.exports = Tasks;