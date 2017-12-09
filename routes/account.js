/**
 *  회원가입, 로그인
 */
var express = require('express');
var router = express.Router();
var url = require("url");
var db_ = require("../db/dbquery");

// ===================회원가입====================
router.get('/signup', function (req, res, next) {
    res.render('account/signup');
});

router.post('/signup/checkId', function (req, res) {
    console.log("포스트후 들어옴");
    var inputId = req.body.inputId;
    console.log('inputId : ', req.body.inputId);
    db_.chkId(inputId, function (results) {
        console.log("체크아이디 들어옴", results);
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

router.post('/signup/finish', function (req, res) {
    console.log("회원가입 마지막 단계옴");
    var input = {
        ID: req.body.user_id, PASSWORD: req.body.password,
        GENDER: req.body.gender, BIRTH: req.body.year + "/" + req.body.month + "/" + req.body.day
    };
    db_.signup(input, function (count) {
        console.log("회원가입완료");
        res.send('<script>alert("회원가입 성공");\
            location.href="/account/login";</script>');
    });
    // res.redirect('/');
});



// ===================로그인=====================

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
        res.redirect("/board");
    }
}

router.get('/login', isNotLogin, function (req, res, next) {
    var params = url.parse(req.url, true).query;
    var data = {error: false};

    if (params["login_error"] == "1") {
        data.error = true;
    }
    res.render('account/login', data);
});

router.post('/login', isNotLogin, function (req, res, next) {
    //디비에서 req정보확인해서 맞으면 세션에 추가, 아니면 로그인에러
    var info = {user_id : req.body.user_id, password : req.body.password};
    console.log('!@#1', info);
    db_.login(info, function(results){
        if(results === false){
            console.log("query error");
        }
        if(results.length === 0){
            console.log("id,password mismatch!!!!!!");
            res.redirect("/account/login?login_error=1");
        }
        else{
            req.session.info = {
                user_id : req.body.user_id,
                password : req.body.password,
            };
            console.log(req.session.info);
            res.redirect('/');
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


// router.get('../', isLogin, function (req, res, next) {
//     console.log('main page');
// });



router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

//
// router.post('/',function(req,res){
//     console.log(req.body.user_id);
//     res.redirect("/");
// });



module.exports = router;