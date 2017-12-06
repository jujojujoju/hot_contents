var express = require('express');
var router = express.Router();
var db_init = require('../db/db_init');
var asyncjs = require('async');
var db_ = require("../db/dbquery");



/* GET users listing. */
router.get('/', function (req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.getBoardList(page, function(data) {

        // res.render('board/list', {title: '게시판', rows: results});
        if (data) {
            if (data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    console.log("ID: " + data.results[i].BOARD_IDX + ", TITLE: " + data.results[i].TITLE + ", LINK : " + data.results[i].LINK);
                }
            }
            console.log("result ok");
            console.log("!@#data", data);
            res.render('board/list', data);

        } else {
            console.log('result error');
        }
    });
});

module.exports = router;
