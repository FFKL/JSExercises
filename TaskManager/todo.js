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
        users.findOne(username, function(err, user) {
            if (user === undefined)
                return done(err, false, {message: 'Неверный логин'});
            if (password != user.password)
                return done(err, false, {message: 'Неверный пароль'});
            return done(err, user)
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
       if (err) {
           done(err);
       } else {
            done(null, user);
        }
    });
});

var auth = passport.authenticate(
    'local', {
        successRedirect: '/user',
        failureRedirect: '/login'
    }
);

app.get('/login', function(req, res) {
    if (req.user !== undefined) {
        res.render('layout', {
            user: req.user
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

app.all('/user', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/user', function(req, res) {
    tasks.list(req.user.id, function(err, tasks) {
        res.render(
            'tasks', {
                tasks: tasks,
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
});

app.post('/user/add', function (req, res) {
    tasks.add(req.user.id, req.body.task, function () {
        res.redirect('/user');
    })
});
app.post('/user/change', function (req, res) {
    tasks.change(req.user.id, req.body.id, req.body.task, function () {
        res.redirect('/user');
    })
});
app.post('/user/complete', function (req, res) {
    tasks.complete(req.user.id, req.body.id, function () {
        res.redirect('/user');
    })
});
app.post('/user/delete', function (req, res) {
    tasks.delete(req.user.id, req.body.id, function () {
        res.redirect('/user');
    })
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.listen(8080);
console.log("Server has started");

handlebars.registerHelper('ifFlag', function(flag, options) {
    if(flag === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});