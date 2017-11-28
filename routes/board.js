var express = require('express');
var router = express.Router();
var db_init = require('../db/db_init');
var asyncjs = require('async');
var db_ = require("./../db/dbquery");

/* GET users listing. */
router.get('/', function (req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

router.get('/list/:page', function (req, res, next) {
    db_.getBoardList(req.params.page, function(results) {
        if (results) {
            if (results.length > 0) {
                for (i = 0; i < results.length; i++) {
                    console.log("ID: " + results[i].BOARD_IDX + ", TITLE: " + results[i].TITLE + ", LINK : " + results[i].LINK);
                }
            }
            console.log("result ok");
            res.render('list', {title: '게시판', rows: results});
        } else {
            console.log('result error');
        }
    });
});

module.exports = router;
