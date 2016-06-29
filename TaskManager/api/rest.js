var mysql = require('mysql'),
    settings = require('../settings');
var pool = mysql.createPool(settings);
var tasks = require('../models/tasks')(pool),
    users = require('../models/users')(pool);
var util = require('util');
var restify = require('restify');

rest = restify.createServer({
    name: 'TODOserver'
});

rest.use(restify.authorizationParser());
rest.use(restify.queryParser());
rest.use(restify.bodyParser());
rest.use(restify.gzipResponse());


rest.use(function(req, res, next) {
    if (req.path().indexOf('/user') != 1) {
        var auth = req.authorization;
        var userId = req.url.toString().split('/')[3];

        if (auth.scheme == null) {
            res.header('WWW-Authenticate', 'Basic realm="Please login"');
            return res.send(401);
        }

        users.findOne(auth.basic.username, function(err, user) {
            if (user === undefined)
                return res.send(401, {message: 'Неверный логин'});
            if (user.password != auth.basic.password)
                return res.send(401, {message: 'Неверный пароль'});
            if (user.id != userId && userId != 'logout')
                return res.send(403, {message: 'Нет доступа к ресурсу'});
            console.log('login ' + auth.basic.username);
            console.log('password ' + auth.basic.password);
            return next();
        });
    } else {
        return next();
    }
});

rest.get('/api/user/:id/tasks', function (req, res) {
    tasks.list(req.params.id, function(err, tasks) {
        if (!err) {
            res.send(200, tasks);
        }
    })
});

rest.post('/api/user/:id/tasks', function (req, res) {
    tasks.add(req.params.id, req.params.task, function (err) {
        if (!err) {
            res.send(201, {result: 'User was added'});
        }
    })
});

rest.put('/api/user/:id/tasks/:taskId/change', function (req, res) {
    tasks.change(req.params.id, req.params.taskId, req.params.task, function (err) {
        if (!err) {
            res.send(204, {result: 'Task was changed'});
        }
    })
});

rest.put('/api/user/:id/tasks/:taskId/complete', function (req, res) {
    tasks.complete(req.params.id, req.params.taskId, function (err) {
        if (!err) {
            res.send(204, {result: 'Task is complete'});
        }
    })
});

rest.del('/api/user/:id/tasks/:taskId', function (req, res) {
    tasks.delete(req.params.id, req.params.taskId, function (err) {
        if (!err) {
            res.send(204, {result: 'Task was deleted'});
        }
    })
});

rest.listen(8080, function () {
    console.log('API launched')
});