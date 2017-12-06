var express = require('express');
var router = express.Router();
var db_init = require('../db/db_init');
var asyncjs = require('async');
var db_ = require("../db/dbquery");

router.get('/', function (req, res, next) {
    res.render('signup');
});

router.post('/checkId', function (req, res) {
    console.log("포스트후 들어옴");
    var inputId = req.body.inputId;
    console.log(req.body.inputId);
    db_.chkId(inputId, function (results) {
        console.log("체크아이디 들어옴");
        var obj = {isPossible: null};
        if (results.length === 0) {
            obj = {isPossible: true};
            console.log("ID 사용 가능함");
        }
        else {
            obj = {isPossible: false};
            console.log("ID 사용 불가능함");
        }
        //JSON을 보내줌
        res.send(obj);
    });
})

router.post('/finish', function (req, res) {
    console.log("회원가입 마지막 단계옴");
    var input = {
        ID: req.body.user_id, PASSWORD: req.body.password,
        GENDER: req.body.gender, BIRTH: req.body.year + "/" + req.body.month + "/" + req.body.day
    };
    db_.signup(input, function (count) {
        console.log("회원가입완료");
    });
    res.redirect('/');
});

module.exports = router;