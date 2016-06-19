module.exports = function(pool) {
    return {
        list: function(userId, callback) {
            pool.query('SELECT * FROM tasks WHERE ?', {user_id: userId}, callback);
        },

        add: function(userId, task, callback) {
            pool.query('INSERT INTO tasks SET ?', {user_id: userId, task: task, flag: false}, callback)
        },

        change: function (userId, taskId, task, callback) {
            pool.query('UPDATE tasks SET ? WHERE ? AND ?', [{task: task}, {user_id: userId}, {id: taskId}], callback)
        },

        complete: function (userId, taskId, callback) {
            pool.query('UPDATE tasks SET ? WHERE ? AND ?', [{flag: true}, {user_id: userId}, {id: taskId}], callback)
        },

        delete: function (userId, taskId, callback) {
            pool.query('DELETE FROM tasks WHERE ? AND ?', [{user_id: userId}, {id: taskId}], callback)
        }
    };
};