var db_init = require('./db_init');

module.exports.searchBoardlist = function (page, keyword, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("ERR[before query]");
                db_init.release(connObj, function () {
                });
                callback(false);

            } else {
                var sql = "select count(*) cnt from BOARD where TITLE LIKE '%" +keyword+"%'";
                console.log(sql);
                console.log(keyword);
                console.log("@@query before execute");
                statement.executeQuery(sql, function(err, resultset){

                    var size = 10;  // 한 페이지에 보여줄 개수
                    var begin = (page - 1) * size + 1; // 시작 글
                    var end = page * size;

                    resultset.toObjArray(function (err, results) {
                        var totalCount = Number(results[0].CNT); // 크롤링 해온 전체 글의 갯수

                        var totalPage = Math.ceil(totalCount / size);  // 전체 페이지의 수 (116 / 10 = 12..)
                        var pageSize = 10; // 페이지 링크의 개수, 10개씩 보여주고 10개씩 넘어감

                        // 1~10페이지는 1로, 11~20페이지는 11로 --> 숫자 첫째자리수를 1로 고정
                        var startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
                        var endPage = startPage + (pageSize - 1);

                        if(endPage > totalPage) {
                            endPage = totalPage;
                        }

                        var query = "SELECT *\n" +
                            "FROM (SELECT rownum AS rnum, a.IDX, a.BOARD_IDX, a.TYPE, a.LINK, a.TITLE, a.TIME, a.TOTAL, a.M10 FROM BOARD a \n" +
                            "WHERE TITLE LIKE '%"+keyword+"%'\n" +
                            "ORDER BY a.IDX DESC) b\n" +
                            "WHERE b.rnum BETWEEN '" + begin + "' AND '" + end + "'";
                        console.log(query);
                        statement.executeQuery(query, function (err, resultset) {
                            if (err) {
                                console.log('@2query', err);
                                db_init.release(connObj, function () {
                                });
                                callback(false);
                            } else {
                                console.log("@@query 11");
                                console.log('Get list query : ', query);
                                resultset.toObjArray(function (err, results) {
                                    db_init.release(connObj, function (err) {
                                        var data = {
                                            title : "게시판",
                                            results : results,
                                            page : page,
                                            pageSize : pageSize,
                                            startPage : startPage,
                                            endPage : endPage,
                                            totalPage : totalPage
                                        }
                                        callback(data);
                                    });

                                });
                            }
                        });
                    });

                });

            }
        });
    });
};


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
                statement.executeQuery(sql, function (err, resultset) {

                    var size = 10;  // 한 페이지에 보여줄 개수
                    var begin = (page - 1) * size + 1; // 시작 글
                    var end = page * size;

                    resultset.toObjArray(function (err, results) {
                        var totalCount = Number(results[0].CNT); // 크롤링 해온 전체 글의 갯수

                        var totalPage = Math.ceil(totalCount / size);  // 전체 페이지의 수 (116 / 10 = 12..)
                        var pageSize = 10; // 페이지 링크의 개수, 10개씩 보여주고 10개씩 넘어감

                        // 1~10페이지는 1로, 11~20페이지는 11로 --> 숫자 첫째자리수를 1로 고정
                        var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1;
                        var endPage = startPage + (pageSize - 1);

                        if (endPage > totalPage) {
                            endPage = totalPage;
                        }

                        var query = "SELECT *\n" +
<<<<<<< HEAD
                        "FROM (SELECT rownum AS rnum, a.IDX, a.BOARD_IDX, a.TYPE, a.LINK, a.TITLE FROM BOARD a\n" +
                            "ORDER BY a.IDX DESC) b\n" +
                            "WHERE b.rnum BETWEEN " + begin + " AND " + end;
=======
                            "FROM (SELECT rownum AS rnum, a.IDX, a.BOARD_IDX, a.TYPE, a.LINK, a.TITLE, a.TOTAL FROM BOARD a) b\n" +
                            "WHERE b.rnum BETWEEN '" + begin + "' AND '" + end + "'";
>>>>>>> 6c2b05d6f56347b4f58152baa2ae37fa7a766ab8

                        statement.executeQuery(query, function (err, resultset) {
                            if (err) {
                                console.log(err);
                                console.log("Error before executeQuery");
                                db_init.release(connObj, function () {
                                });
                                callback(false);
                            } else {
                                console.log('Get list query : ', query);
                                resultset.toObjArray(function (err, results) {
                                    db_init.release(connObj, function (err) {
                                        var data = {
<<<<<<< HEAD
                                            title : "게시판",
                                            results : results,
                                            page : page,
                                            pageSize : pageSize,
                                            startPage : startPage,
                                            endPage : endPage,
                                            totalPage : totalPage
                                        }
                                        callback(data);
                                    });

                                });
                            }
                        });
                    });

                });

            }
        });
    });
};

module.exports.getBoardList_M10 = function (page, callback) {
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
                console.log("@@query before execute");
                statement.executeQuery(sql, function(err, resultset){

                    var size = 10;  // 한 페이지에 보여줄 개수
                    var begin = (page - 1) * size + 1; // 시작 글
                    var end = page * size;

                    resultset.toObjArray(function (err, results) {
                        var totalCount = Number(results[0].CNT); // 크롤링 해온 전체 글의 갯수

                        var totalPage = Math.ceil(totalCount / size);  // 전체 페이지의 수 (116 / 10 = 12..)
                        var pageSize = 10; // 페이지 링크의 개수, 10개씩 보여주고 10개씩 넘어감

                        // 1~10페이지는 1로, 11~20페이지는 11로 --> 숫자 첫째자리수를 1로 고정
                        var startPage = Math.floor((page-1) / pageSize) * pageSize + 1;
                        var endPage = startPage + (pageSize - 1);

                        if(endPage > totalPage) {
                            endPage = totalPage;
                        }

                        var query = "SELECT *\n" +
                            "FROM (SELECT rownum AS rnum, a.IDX, a.BOARD_IDX, a.TYPE, a.LINK, a.TITLE, a.TIME, a.TOTAL, a.M10 FROM BOARD a \n" +
                            "WHERE a.TIME BETWEEN sysdate-1 AND sysdate \n" +
                            "ORDER BY M10 DESC, TOTAL DESC) b\n" +
                            "WHERE b.rnum BETWEEN '" + begin + "' AND '" + end + "'";

                        statement.executeQuery(query, function (err, resultset) {
                            if (err) {
                                console.log(err);
                                db_init.release(connObj, function () {
                                });
                                callback(false);
                            } else {
                                console.log("@@query 11");
                                console.log('Get list query : ', query);
                                resultset.toObjArray(function (err, results) {
                                    db_init.release(connObj, function (err) {
                                        var data = {
                                            title : "게시판",
                                            results : results,
                                            page : page,
                                            pageSize : pageSize,
                                            startPage : startPage,
                                            endPage : endPage,
                                            totalPage : totalPage
                                        }
=======
                                            title: "게시판",
                                            results: results,
                                            page: page,
                                            pageSize: pageSize,
                                            startPage: startPage,
                                            endPage: endPage,
                                            totalPage: totalPage
                                        };
>>>>>>> 6c2b05d6f56347b4f58152baa2ae37fa7a766ab8
                                        callback(data);
                                    });

                                });
                            }
                        });
                    });

                });

            }
        });
    });
};

<<<<<<< HEAD

module.exports.chkId = function(ID, callback) {
=======
module.exports.chkId = function (ID, callback) {
>>>>>>> 6c2b05d6f56347b4f58152baa2ae37fa7a766ab8
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function () {
                });
                callback(false);
            } else {
                var s = "SELECT * FROM USERS WHERE USER_ID='" + ID + "'";
                console.log(s);

                statement.executeQuery(s,
                    function (err, resultset) {
                        if (err) {
                            console.log(err);
                            console.log("쿼리실행후 에러");
                            db_init.release(connObj, function () {
                            });
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

// 회원가입
module.exports.signup = function (input, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function () {
                });
                callback(false);
            } else {
                var s = "INSERT INTO USERS VALUES('" + input.ID + "','"
                    + input.PASSWORD + "'," + input.GENDER + ",'" + input.BIRTH + "')";
                console.log(s);
                statement.executeUpdate(s,
                    function (err, count) {
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

module.exports.login = function (info, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function () {
                });
                callback(false);
            } else {
                var s = "SELECT * FROM USERS WHERE USER_ID='" + info.user_id + "'"
                    + "AND PASSWORD='" + info.password + "'";
                console.log(s);
                statement.executeQuery(s,
                    function (err, resultset) {
                        if (err) {
                            console.log(err);
                            console.log("쿼리실행후 에러");
                            db_init.release(connObj, function () {
                            });
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

module.exports.post_clicked = function (data, callback) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log("쿼리실행전 에러");
                db_init.release(connObj, function () {
                });
                callback(false);
            } else {
                var query = "";
                // var user
                if(data.user_type == "UNKNOWN")
                {
                    query = "UPDATE BOARD " +
                        "SET TOTAL = NVL(TOTAL, 0) + 1 , " +
                        "UNKNOWN = NVL(UNKNOWN, 0) + 1 " +
                        "WHERE IDX=" + data.post_idx;
                }else
                {

                }
                console.log(query);
                statement.executeUpdate(query,
                    function (err, c1) {
                        if (err) {
                            console.log(err)
                            callback(err);
                        } else {
                            query = "INSERT INTO USER_VIEW VALUES (view_seq.nextval, '" + data.user_id + "' , " + data.post_idx + ")";
                            console.log(query);
                            statement.executeUpdate(query,
                                function (err, c2) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        console.log("user_view update complete")
                                        db_init.release(connObj, function (err) {
                                        });
                                        callback(c2);
                                    }
                                });

                        }
                    });
            }
        });
    });
};
