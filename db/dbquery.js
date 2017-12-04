var db_init = require('./db_init');
var asyncjs = require('async');

module.exports.getBoardList = function(page, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                db_init.release(connObj, function(){});
                callback(false);
            } else {
                statement.executeQuery("SELECT * FROM BOARD",
                    function (err, resultset) {
                        if (err) {
                            db_init.release(connObj, function(){});
                            callback(false);
                        } else {
                            resultset.toObjArray(function (err, results) {
                                db_init.release(connObj, function (err) {
                                    callback(results);
                                });
                            });
                        }
                    });
            }
        });
    });
};

module.exports.chkId = function(ID, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function(){});
                callback(false);
            } else {
                var s = "SELECT * FROM USERS WHERE USER_ID='"+ID + "'";
                console.log(s);

                statement.executeQuery(s,
                    function (err, resultset) {
                        if (err) {
                            console.log(err);
                            console.log("쿼리실행후 에러");
                            db_init.release(connObj, function(){});
                            callback(false);
                        } else {
                            console.log("쿼리실행후 에러 안남");
                            resultset.toObjArray(function (err, results) {
                                db_init.release(connObj, function (err) {
                                   // console.log(results[0].USER_ID);
                                    callback(results);
                                });
                            });
                        }
                    });
            }
        });
    });
};

module.exports.signup = function(input, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function(){});
                callback(false);
            } else {
                var s = "INSERT INTO USERS VALUES('"+input.ID+"','"
                    +input.PASSWORD+"',"+input.GENDER+",'"+input.BIRTH+"')";
                console.log(s);
                statement.executeUpdate(s,
                    function(err, count) {
                        if (err) {
                            console.log("쿼리실행후 에러남");
                            callback(err);
                        } else {
                            console.log("쿼리실행후 에러 안남");
                            callback(count);
                        }
                    });
            }
        });
    });
};

module.exports.login = function(info, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function(){});
                callback(false);
            } else {
                var s = "SELECT * FROM USERS WHERE USER_ID='"+info.user_id + "'"
                + "AND PASSWORD='"+info.password+"'";
                console.log(s);
                statement.executeQuery(s,
                    function (err, resultset) {
                        if (err) {
                            console.log(err);
                            console.log("쿼리실행후 에러");
                            db_init.release(connObj, function(){});
                            callback(false);
                        } else {
                            console.log("쿼리실행후 에러 안남");
                            resultset.toObjArray(function (err, results) {
                                db_init.release(connObj, function (err) {
                                    // console.log(results[0].USER_ID);
                                    callback(results);
                                });
                            });
                        }
                    });
            }
        });
    });
};




