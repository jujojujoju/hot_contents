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
    db_.getBoardList(page, function (data) {
        data['isLogin'] = req.session.info != undefined;
        if (data) {
            console.log("get list ok");
            // data.userid
            res.render('board/list', data);
        } else {
            console.log('result error');
        }
    });
});

router.post('/point', function (req, res, next) {
    var cur = new Date();
    console.log(cur);
    if (req.session.info == undefined) {
        var data = {
            user_type : "UNKNOWN",
            post_idx : req.body.point,
            user_id : cur.toString().replace(/\s/g, '')
            // user_id: req.session.info.user_id,
            // user_gender: req.session.info.user_gender,
            // user_birth: req.session.info.user_birth
        };
        // console.log(data.post_idx)
        db_.post_clicked(data, function (result) {
            console.log("total point update complete")
        });
    }else
    {

    }

});

module.exports = router;
