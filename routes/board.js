var express = require('express');
var router = express.Router();
var db_init = require('../db/db_init');
var asyncjs = require('async');
var db_ = require("../db/dbquery");

router.get('/', function (req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

// 전체글
router.get('/list/:page', function (req, res, next) {
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.getBoardList(page, function(data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("get list ok");
            res.render('board/list', data);

        } else {
            console.log('result error');
        }
    });
});

router.post('/list/search/:page', function (req, res, next) {

    var keyword = req.body.keyword;
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.searchBoardlist(page, keyword, function(data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("get list ok");
            res.render('board/list', data);

        } else {
            console.log('result error');
        }
    });
});


// 10대남 HOT-게시판
router.get('/M10list/:page', function (req, res, next) {
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.getBoardList_M10(page, function(data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("10대 list ok");
            res.render('board/M10list', data);

        } else {
            console.log('result error');
        }
    });
});





module.exports = router;
