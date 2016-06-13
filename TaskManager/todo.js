var tasks = require('./models/tasks');

var express = require('express');
var app = express();

var handlebars = require('handlebars');

var bodyParser = require('body-parser');
app.use(bodyParser());

var templates = require('consolidate');
app.engine('hbs', templates.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var request = require('request');

handlebars.registerHelper('ifFlag', function(flag, options) {
    if(flag === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.get('/', function(req, res) {
    tasks.list(function(err, tasks) {
        res.render(
            'tasks',
            {tasks: tasks},
            function(err, html) {
                if (err)
                    throw err;

                res.render('layout', {
                    content: html
                })
            }
        )
    })
});

app.post('/add', function (req, res) {
    tasks.add(req.body.task, function () {
        res.redirect('/');
    })
});
app.post('/change', function (req, res) {
    tasks.change(req.body.id, req.body.task, function () {
        res.redirect('/');
    })
});
app.post('/complete', function (req, res) {
    tasks.complete(req.body.id, function () {
        res.redirect('/');
    })
});
app.post('/delete', function (req, res) {
    tasks.delete(req.body.id, function () {
        res.redirect('/');
    })
});
app.listen(8080);
console.log("Server has started");