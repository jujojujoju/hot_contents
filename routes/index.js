var express = require('express');
var router = express.Router();
var db_ = require("../db/dbquery");

/* Home page. */
router.get('/', function(req, res){
    res.redirect('/board/list/1');
});

module.exports = router;
