module.exports =  function(tasks) {
    return {
        getTasksList: function(req, res) {
            tasks.list(req.user.id, function(err, tasks) {
                res.render(
                    'tasks', {
                        tasks: tasks
                    },
                    function(err, html) {
                        if (err)
                            throw err;
                        res.render('layout', {
                            content: html,
                            user: req.user
                        })
                    }
                )
            })
        },
        addTask: function (req, res) {
            tasks.add(req.user.id, req.body.task, function () {
                res.redirect('/user');
            })
        },
        changeTask: function (req, res) {
            tasks.change(req.user.id, req.body.id, req.body.task, function () {
                res.redirect('/user');
            })
        },
        setComplete: function (req, res) {
            tasks.complete(req.user.id, req.body.id, function () {
                res.redirect('/user');
            })
        },
        deleteTask: function (req, res) {
            tasks.delete(req.user.id, req.body.id, function () {
                res.redirect('/user');
            })
        }

    }
};