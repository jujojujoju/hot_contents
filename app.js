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

var index = require('./routes/index');
var users = require('./routes/users');
var db_init = require('./db/db_init');
var board = require('./routes/board');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(myCookieParser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    key: "connect.sid",
    resave: false,
    saveUninitialized: true
    // store: sessionStore
    //cookie  : { maxAge  : new Date(Date.now() + (10 * 1000 * 1)) }
}));
app.use('/', index);
app.use('/users', users);
app.use('/board', board);

var port = 1111;
app.set('port', port);

var server = http.createServer(app);

db_init.init(function (err) {
    if (err) {
        console.log(err);
    } else {
        server.listen(port);
    }
});


// catch 404 and forward to error handler
app.use(function (r1eq, res, next) {
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

module.exports = app;