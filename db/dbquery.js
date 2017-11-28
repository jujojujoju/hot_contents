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
