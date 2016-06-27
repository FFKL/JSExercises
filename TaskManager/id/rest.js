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

rest.get('/api/user/:id/tasks', function (req, res) {
    tasks.list(req.params.id, function(err, tasks) {
        if (!err) {
            res.send(200, tasks);
        }
    })
});

rest.post('/api/user/:id/tasks/add', function (req, res) {
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

rest.del('/api/user/:id/tasks/:taskId/delete', function (req, res) {
    tasks.delete(req.params.id, req.params.taskId, function (err) {
        if (!err) {
            res.send(204, {result: 'Task was deleted'});
        }
    })
});

rest.listen(8080, function () {
    console.log('API launched')
});