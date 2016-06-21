var mysql = require('mysql'),
    settings = require('./settings');

var pool = mysql.createPool(settings);
var tasks = require('./models/tasks')(pool),
    users = require('./models/users')(pool);
var tasksController = require('./controllers/tasksController')(tasks),
    userController = require('./controllers/userController')
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
app.use(session({secret: 'SECRET'}));

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

var mustBeAuthenticated = function(req, res, next) {
    req.isAuthenticated() ? next() : res.redirect('/');
};

app.get('/', auth);
app.post('/login', auth);

app.get('/login', userController.login);
app.get('/logout', userController.logout);

app.all('/user', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/user', tasksController.getTasksList);
app.post('/user/add', tasksController.addTask);
app.post('/user/change', tasksController.changeTask);
app.post('/user/complete', tasksController.setComplete);
app.post('/user/delete', tasksController.deleteTask);

app.listen(8080);
console.log("Server has started");

handlebars.registerHelper('ifFlag', function(flag, options) {
    if(flag === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});