var db_init = require('./db_init');
var asyncjs = require('async');

// module.exports.getBoardList = function(page, callback) {
//     db_init.reserve(function (connObj) {
//         var conn = connObj.conn;
//         conn.createStatement(function (err, statement) {
//             if (err) {
//                 db_init.release(connObj, function(){});
//                 callback(false);
//             } else {
//                 statement.executeQuery("SELECT * FROM BOARD",
//                     function (err, resultset) {
//                         if (err) {
//                             db_init.release(connObj, function(){});
//                             callback(false);
//                         } else {
//                             resultset.toObjArray(function (err, results) {
//                                 db_init.release(connObj, function (err) {
//                                     callback(results);
//                                 });
//                             });
//                         }
//                     });
//             }
//         });
//     });
// };

// Pagination
module.exports.getBoardList = function (page, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("ERR[before query]");
                db_init.release(connObj, function () {
                });
                callback(false);

            } else {
                var sql = "select count(*) cnt from board";
                statement.executeQuery(sql, function(err, resultset){
                    console.log("일단은 성공", err);
                    var size = 10;  // 한 페이지에 보여줄 개수
                    var begin = (page - 1) * size; // 시작 글
                    var end = page * size;

                    resultset.toObjArray(function (err, results) {
                        var totalCount = Number(results[0].CNT); // 크롤링 해온 전체 글의 갯수
                        console.log('total? ', totalCount);

                        var totalPage = Math.ceil(totalCount / size);  // 전체 페이지의 수 (116 / 10 = 12..)
                        console.log('totalPage? ', totalPage);
                        var pageSize = 10; // 페이지 링크의 개수, 10개씩 보여주고 10개씩 넘어감

                        // 1~10페이지는 1로, 11~20페이지는 11로 --> 숫자 첫째자리수를 1로 고정
                        var startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
                        var endPage = startPage + (pageSize - 1);

                        if(endPage > totalPage) {
                            endPage = totalPage;
                        }
                        // 전체 글이 존재하는 갯수
                        var max = totalCount - ((page-1) * size);

                        var query = "SELECT *\n" +
                        "FROM (SELECT rownum AS rnum, a.IDX, a.BOARD_IDX, a.TYPE, a.LINK, a.TITLE FROM BOARD a) b\n" +
                            "WHERE b.rnum BETWEEN '" + begin + "' AND '" + end + "'";

                        statement.executeQuery(query, function (err, resultset) {
                            if (err) {
                                console.log(err);
                                console.log("쿼리실행전 에러");
                                db_init.release(connObj, function () {
                                });
                                callback(false);
                            } else {
                                console.log('query? ', query);
                                console.log("휴 다행..");
                                // console.log("rows", rows);

                                resultset.toObjArray(function (err, results) {
                                    db_init.release(connObj, function (err) {

                                        var data = {
                                            title : "게시판",
                                            results : results,
                                            page : page,
                                            pageSize : pageSize,
                                            startPage : startPage,
                                            endPage : endPage,
                                            totalPage : totalPage,
                                            max : max
                                        }
                                        console.log('하.. siba 됬네');
                                        callback(data);
                                    });

                                });
                            }
                        });
                    });
                    // return;




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
                                    callback(resultset);
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




