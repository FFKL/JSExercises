var mysql = require('mysql'),
    settings = require('./settings.js');

var pool = mysql.createPool(settings);
var tasks = require('./models/tasks')(pool),
    users = require('./models/users')(pool);

var express = require('express');
var handlebars = require('handlebars');
var bodyParser = require('body-parser');
var request = require('request');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var app = express();

var templates = require('consolidate');
app.engine('hbs', templates.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({keys:['SECRET']}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        users.get(username, function(err, users) {
            if (username != users[0].username)
                return done(null, false, {message: 'Неверный логин'});
            if (password != users[0].password)
                return done(null, false, {message: 'Неверный пароль'});

            return done(null, {username: users[0].username})
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, {username: id});
});

var auth = passport.authenticate(
    'local', {
        successRedirect: '/index',
        failureRedirect: '/login'
    }
);

app.get('/login', function(req, res) {
    if (req.user !== undefined) {
        res.render('layout', {
            username: req.user.username
        });
    } else {
        res.render('layout');
    }
});

app.get('/', auth);
app.post('/login', auth);

var mustBeAuthenticated = function(req, res, next) {
    req.isAuthenticated() ? next() : res.redirect('/');
};

app.all('/', mustBeAuthenticated);
app.all('/*', mustBeAuthenticated);

app.get('/index', function(req, res) {
    tasks.list(function(err, tasks) {
        res.render(
            'tasks',
            {tasks: tasks},
            function(err, html) {
                if (err)
                    throw err;
                res.render('layout', {
                    content: html,
                    username: req.user.username
                })
            }
        )
    })
});

app.post('/add', function (req, res) {
    tasks.add(req.body.task, function () {
        res.redirect('/index');
    })
});
app.post('/change', function (req, res) {
    tasks.change(req.body.id, req.body.task, function () {
        res.redirect('/index');
    })
});
app.post('/complete', function (req, res) {
    tasks.complete(req.body.id, function () {
        res.redirect('/index');
    })
});
app.post('/delete', function (req, res) {
    tasks.delete(req.body.id, function () {
        res.redirect('/index');
    })
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/index');
});
app.listen(8080);
console.log("Server has started");

handlebars.registerHelper('ifFlag', function(flag, options) {
    if(flag === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});