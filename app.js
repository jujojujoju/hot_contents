var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// var sessionStore = new require('session-memory-store')(session)();
var myCookieParser = cookieParser('@#@$MYSIGN#@$#$');

// Add routes path
var index = require('./routes/index');
var board = require('./routes/board');
var account = require('./routes/account');

// database
var db_init = require('./db/db_init');

var app = express();

//----------login, signup module----------//
//using passport,flash
var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.signup(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(myCookieParser);
app.use(express.static(path.join(__dirname, 'public')));

//----------passport init----------//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    app.locals.isLogin = req.isAuthenticated();
    // app.locals.userData = req.user;
    next();
});

//----------passport strategy setting----------//
/*var LocalStrategy =require('passport-local').strategy;

passport.use('local-login',new LocalStrategy({
    //field setting
    /!*
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true //콜백에 전달
    *!/
},function(req,username,password,done){
    //local auth
    console.log('passport, local-login called: ' + username + ','
        + password);

}));*/


app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    key: "connect.sid",
    resave: false,
    saveUninitialized: true
    // store: sessionStore
    //cookie  : { maxAge  : new Date(Date.now() + (10 * 1000 * 1)) }
}));

// routing
app.use('/', index);
app.use('/board', board);
app.use('/account', account);

var port = 8650;
app.set('port', port, function (err) {
    console.log(err);
});

var server = http.createServer(app, function (err) {
    console.log(err);
});

// db initialize
db_init.init(function (err) {
    if (err) {
        console.log(err);
    } else {
        server.listen(port, function(){
            console.log('Server running at : ' + port);
        });
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
