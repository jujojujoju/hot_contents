var express = require('express');
var router = express.Router();
var crawler = require('./../crawler/crawler1');
var cheerio = require("cheerio");
var url = require("url");
var db = require('../db/db_init');
var db_ = require("../db/dbquery");
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
    //디비에서 req정보확인해서 맞으면 세션에 추가, 아니면 로그인에러
    var info = {user_id : req.body.user_id, password : req.body.password};
    db_.login(info,function(results){
        if(results === false){
            console.log("query error");
        }
        if(results.length === 0){
            console.log("id,password mismatch!!!!!!");
            res.redirect("/?login_error=1");
        }
        else{
            req.session.info = {
                user_id : req.body.user_id,
                password : req.body.password
            };
            res.redirect("/main");
        }
    })
    ////

    /*
    if (req.body.user_id == 'a') {
        req.session.info = {
            user_id: req.body.user_id, password: req.body.password
        };
        res.redirect("/main");
    }
    else
        res.redirect("/?login_error=1");
    */
});

router.post('/',function(req,res){
    console.log(req.body.user_id);
    res.redirect("/main");
});

module.exports = router;
