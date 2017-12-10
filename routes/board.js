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

// 전체글
router.get('/list/:page', function (req, res, next) {
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.getBoardList(page, function (data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("get list ok");
            console.log("date")
            // console.log("================================"+data.results[0].TOTAL)
            res.render('board/list', data);
        } else {
            console.log('result error');
        }
    });
});

router.get('/list/search/:page', function (req, res, next) {

    var keyword = req.param('keyword');
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.searchBoardlist(page, keyword, function (data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("get list ok");
            res.render('board/list', data);
        } else {
            console.log('result error');
        }
    });
});

//
// 10대남 HOT-게시판
router.get('/M10list/:page', function (req, res, next) {
    var page = req.params.page;
    page = parseInt(page, 10);
    db_.getBoardList_M10(page, function (data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("10대 list ok");
            res.render('board/M10list', data);

        } else {
            console.log('result error');
        }
    });
});


router.post('/point', function (req, res) {
    var cur = new Date();
    console.log(cur);
    var data;
    if (req.session.info == undefined) {
        data = {
            user_type: "UNKNOWN",
            post_idx: req.body.idx,
            user_id: cur.toString().replace(/\s/g, '')
        };
    }
    //로그인을 한 상태에서 게시글을 클릭하였을때!
    else {
        data = {
            user_type: "KNOWN",
            post_idx: req.body.idx,
            user_id: req.session.info.user_id,
            gender: req.session.info.gender,
            age: req.session.info.user_age
        };
    }
    db_.post_clicked(data, function (result) {
        console.log("total point update complete");
        res.send(result);
    });

});

module.exports = router;
