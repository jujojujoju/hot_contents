var express = require('express');
var router = express.Router();
var crawler = require('./../crawler/crawler1');
var cheerio = require("cheerio");
var url = require("url");
var db = require('../db/db_init');

var app = require('../app');
function isLogin(req, res, next) {
    if (req.session.info != undefined) {
        next();
    } else {
        res.redirect("/");
    }
}

function isNotLogin(req, res, next) {
    if (req.session.info == undefined) {
        next();
    } else {
        res.redirect("/main");
    }
}

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

router.get('/', isNotLogin, function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var data = {error: false};

    if (params["login_error"] == "1") {
        data.error = true;
    }
    res.render('index', data);
});

router.get('/main', isLogin, function (req, res, next) {
    console.log('main page');
    res.render('main');
});

router.post('/login', isNotLogin, function (req, res, next) {

    if (req.body.user_id == 'a') {
        req.session.info = {
            user_id: req.body.user_id, password: req.body.password
        };
        res.redirect("/main");
    }
    else
        res.redirect("/?login_error=1");

});

module.exports = router;
